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
      backendTokens: data,
      user: token.user,
    };
  } catch (err) {
    console.error("Refresh token exception:", err);
    return { ...token, error: "RefreshTokenException" };
  }
}
export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials Provider (Email/Password Login)
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
          }); // ✅ FIX: Added missing closing parenthesis

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

    // Google OAuth Provider
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
      // ✅ FIX: Call backend to create/update Google user
      if (account?.provider === "google" && profile) {
        try {
          console.log("Calling backend Google callback with profile:", profile);

          const res = await fetch(`${Backend_URL}/api/auth/google/callback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
              image: (profile as any).picture, // ✅ FIX: Google uses 'picture', not 'image'
            }),
          });
          if (!res.ok) {
            const errorText = await res.text();
            console.error("Google callback failed:", res.status, errorText);
            return false;
          }

          const data = await res.json();
          console.log("Backend returned user:", data.user);

          // ✅ Update user object with backend response
          user.id = data.user.id;
          user.email = data.user.email;
          user.name = data.user.name;
          (user as any).role = data.user.role;
          (user as any).status = data.user.status;
          (user as any).backendTokens = data.backendTokens;

          return true;
        } catch (err) {
          console.error("Google sign-in error:", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // First login with Credentials or Google
      if (user) {
        token.user = {
          id: (user as any).id || "",
          email: (user as any).email || "",
          name: (user as any).name || "",
          role: (user as any).role || "USER",
          status: (user as any).status || "ACTIVE",
        };
        // Store backend tokens with expiry
        if ((user as any).backendTokens) {
          token.backendTokens = (user as any).backendTokens;

          // ✅ CRITICAL FIX: Ensure expiresIn is set on first login
          if (token.backendTokens && !token.backendTokens.expiresIn) {
            // Set expiry to 20 seconds from now (matching backend)
            token.backendTokens.expiresIn = Date.now() + 20000;
          }
        }
        return token;
      }
      // ✅ FIX: Check if token needs refresh
      const backendTokens = (token as any).backendTokens;
      // If no backend tokens, return token as-is
      if (!backendTokens) {
        return token;
      }
      const expiresIn = backendTokens.expiresIn;
      // If no expiry set, don't attempt refresh
      if (!expiresIn) {
        console.warn("No expiresIn found on token, skipping refresh");
        return token;
      }
      const now = Date.now();
      const bufferTime = 5000; // Refresh 5 seconds before expiry
      // If token still valid (with buffer), return it
      if (now < expiresIn - bufferTime) {
        return token;
      }
      // Token expired or about to expire, refresh it
      console.log("Token expired or expiring soon, refreshing...");
      const refreshed = await refreshToken(token as any);
      if (refreshed.error) {
        console.error("Token refresh failed:", refreshed.error);
        return { ...token, error: "RefreshTokenError" };
      }
      return refreshed;
    },
    async session({ session, token }) {
      if ((token as any).error) {
        console.error("Session has token error:", (token as any).error);
        // Token refresh failed, invalidate session
        (session as any).error = (token as any).error;
      }
      session.user = (token as any).user || session.user;
      (session as any).backendTokens = (token as any).backendTokens;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after login
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`; // ✅ FIX: Default redirect to dashboard
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // ✅ FIX: Add debug mode (remove in production)
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
