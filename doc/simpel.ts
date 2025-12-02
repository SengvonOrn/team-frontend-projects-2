import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Backend_URL } from "@/constants/ConstantsUrl";

async function refreshToken(token: any) {
  try {
    const res = await fetch(`${Backend_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.backendTokens?.refreshToken}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Failed to refresh token", res.status);
      return { ...token, error: "RefreshTokenError" };
    }

    const data = await res.json();
    return {
      ...token,
      backendTokens: {
        ...data,
        expiresIn: Date.now() + 20000, // Reset expiry
      },
      user: token.user,
    };
  } catch (err) {
    console.error("Refresh token exception:", err);
    return { ...token, error: "RefreshTokenException" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${Backend_URL}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (res.status === 401) {
            console.log("Invalid credentials");
            return null;
          }

          if (!res.ok) {
            console.error("Login failed:", res.statusText);
            return null;
          }

          const data = await res.json();
          return {
            ...data.user,
            backendTokens: data.backendTokens,
          };
        } catch (err) {
          console.error("Login error:", err);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId:
        process.env.GOOGLE_CLIENT_ID ||
        "738418260560-33pj9s53l5kqs57i4q52onbfe68ttk3o.apps.googleusercontent.com",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ||
        "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",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === "google" && profile) {
        try {
          console.log("🔵 Calling backend Google callback with profile:", {
            email: profile.email,
            name: profile.name,
          });

          const res = await fetch(`${Backend_URL}/api/auth/google/callback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
              image: (profile as any).picture,
            }),
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ Google callback failed:", res.status, errorText);
            return false;
          }

          const data = await res.json();
          console.log("✅ Backend returned data:", data);

          // ✅ CRITICAL: Update user object with ALL backend data
          user.id = data.user.id.toString(); // Ensure it's a string
          user.email = data.user.email;
          user.name = data.user.name;
          user.image = data.user.image || (profile as any).picture;

          // Store additional user fields
          (user as any).role = data.user.role;
          (user as any).status = data.user.status;

          // Store backend tokens with expiry
          (user as any).backendTokens = {
            accessToken: data.backendTokens.accessToken,
            refreshToken: data.backendTokens.refreshToken,
            expiresIn: Date.now() + 20000, // 20 seconds
          };

          console.log("✅ User object updated with backend data");
          return true;
        } catch (err) {
          console.error("❌ Google sign-in error:", err);
          return false;
        }
      }

      // Allow credentials login
      return true;
    },

    async jwt({ token, user, account }) {
      // ✅ First login (Credentials or Google)
      if (user) {
        console.log("🔵 JWT Callback - First login, storing user data");

        token.user = {
          id: (user as any).id || user.id,
          email: user.email || "",
          name: user.name || "",
          // image: user.image || "",
          role: (user as any).role || "USER",
          status: (user as any).status || "ACTIVE",
        };

        // Store backend tokens
        if ((user as any).backendTokens) {
          token.backendTokens = (user as any).backendTokens;
          console.log("✅ Backend tokens stored in JWT");
        }

        return token;
      }

      // ✅ Subsequent requests - check if token needs refresh
      const backendTokens = (token as any).backendTokens;

      if (!backendTokens || !backendTokens.expiresIn) {
        console.log("⚠️ No backend tokens or expiry, skipping refresh");
        return token;
      }

      const now = Date.now();
      const bufferTime = 5000; // Refresh 5 seconds before expiry

      // Token still valid
      if (now < backendTokens.expiresIn - bufferTime) {
        return token;
      }

      // Token expired, refresh it
      console.log("🔄 Token expired, refreshing...");
      const refreshed = await refreshToken(token as any);

      if (refreshed.error) {
        console.error("❌ Token refresh failed:", refreshed.error);
        return { ...token, error: "RefreshTokenError" };
      }

      console.log("✅ Token refreshed successfully");
      return refreshed;
    },

    async session({ session, token }) {
      // Check for token errors
      if ((token as any).error) {
        console.error("❌ Session has token error:", (token as any).error);
        (session as any).error = (token as any).error;
      }

      // ✅ Populate session with user data from token
      if ((token as any).user) {
        session.user = {
          ...session.user,
          ...(token as any).user,
        };
      }

      // Add backend tokens to session
      (session as any).backendTokens = (token as any).backendTokens;

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after login
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
