import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Backend_URL } from "@/constants/ConstantsUrl";
// Helper function to extract expiration from JWT token
function getExpiresInFromToken(accessToken: string): number {
  try {
    // Decode JWT (base64url decode the payload)
    const parts = accessToken.split(".");
    if (parts.length !== 3) return Date.now() + 900000; // Default 15 minutes

    // Base64URL decode (replace - with +, _ with /, add padding if needed)
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    // Decode using Buffer (Node.js API route)
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(decoded);

    if (payload.exp) {
      // exp is in seconds, convert to milliseconds
      return payload.exp * 1000;
    }
    return Date.now() + 900000; // Default 15 minutes if no exp
  } catch (err) {
    console.warn("Could not decode JWT, using default expiry", err);
    return Date.now() + 900000; // Default 15 minutes
  }
}

//============================================================
// Refresh token function
//===========================================================

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
    // Calculate expiresIn from the new accessToken if not provided
    const expiresIn = data.expiresIn
      ? typeof data.expiresIn === "number"
        ? data.expiresIn
        : Date.now() + data.expiresIn
      : getExpiresInFromToken(data.accessToken || "");

    return {
      ...token,
      backendTokens: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: expiresIn,
      },
      user: token.user,
    };
  } catch (err) {
    console.error("Refresh token exception:", err);
    return { ...token, error: "RefreshTokenException" };
  }
}

// ============================================================
// NextAuth Options
// ============================================================

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

      // ============================================
      // Authorize function for credentials provider
      // ============================================

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
          if (res.status === 401) return null;
          if (!res.ok) return null;
          const data = await res.json();
          console.log("LOGIN RESPONSE DATA", data);
          // Ensure email is always a non-empty string to satisfy CustomUser type
          const userEmail = data.user?.email;
          if (!userEmail || typeof userEmail !== "string") {
            console.error("Invalid email in login response");
            return null;
          }
          // Ensure id is present (string or number)
          const userId = data.user?.id;
          if (!userId) {
            console.error("Invalid id in login response");
            return null;
          }
          // Calculate expiresIn from accessToken if not provided
          const backendTokens = data.backendTokens || {};
          if (!backendTokens.expiresIn && backendTokens.accessToken) {
            backendTokens.expiresIn = getExpiresInFromToken(
              backendTokens.accessToken
            );
          }

          return {
            id: userId,
            name: data.user?.name,
            email: userEmail,
            image: data.user?.image,
            role: data.user?.role,
            status: data.user?.status,
            backendTokens: backendTokens,
          };
        } catch (err) {
          console.error("Login error in authorize", err);
          return null;
        }
      },

      // ============================================
      // End of authorize function
      // ============================================
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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

  //===========================================
  // Callbacks
  //===========================================
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile) {
        try {
          const backendUrl = `${Backend_URL}/api/auth/google/callback`;
          const res = await fetch(backendUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
              image: (profile as any).picture || profile.image || null,
            }),
          });
          const data = await res.json();
          if (!res.ok) return false;
          user.id = data.user.id.toString();
          user.email = data.user.email;
          user.name = data.user.name;
          user.image = data.user.image;
          (user as any).role = data.user.role;
          (user as any).status = data.user.status;
          // Calculate expiresIn from accessToken if not provided
          const backendTokens = data.backendTokens || {};
          if (!backendTokens.expiresIn && backendTokens.accessToken) {
            backendTokens.expiresIn = getExpiresInFromToken(
              backendTokens.accessToken
            );
          }
          (user as any).backendTokens = backendTokens;
          return true;
        } catch (err) {
          console.error("Google sign-in error:", err);
          return false;
        }
      }
      return true;
    },

    //===========================================
    // JWT Callback
    //===========================================
    async jwt({ token, user, trigger, session }) {
      if (user) {
        console.log("JWT USER IN CALLBACK", user);
        // Explicitly construct user object to match CustomUser type
        token.user = {
          id: user.id,
          email: user.email || "",
          name: user.name || undefined,
          image: user.image || undefined,
          role: (user as any).role,
          status: (user as any).status,
        };
        token.backendTokens = (user as any).backendTokens;
        // Clear any previous errors on new login
        delete (token as any).error;
      }
      if (trigger === "update" && session) {
        token.user = {
          ...token.user,
          ...session.user,
        };
      }

      // Check if token has an error (from previous refresh failure)
      if ((token as any).error) {
        console.log(
          "Token has error, not attempting refresh:",
          (token as any).error
        );
        return token;
      }

      // Check if token needs refresh (only if expiresIn exists)
      if (token.backendTokens?.expiresIn) {
        const now = Date.now();
        const expiresIn = token.backendTokens.expiresIn;

        // If token has already expired, mark as error
        if (now >= expiresIn) {
          console.log("Token has expired, marking session as expired");
          return { ...token, error: "TokenExpired" };
        }

        // Refresh 5 seconds before expiry
        const shouldRefresh = now >= expiresIn - 5000;
        if (shouldRefresh) {
          console.log("Token expiring soon, attempting refresh...");
          const refreshed = await refreshToken(token);

          // If refresh failed, mark token with error
          if ((refreshed as any).error) {
            console.log("Token refresh failed, marking session as expired");
            return { ...token, error: "RefreshTokenError" };
          }

          return refreshed;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Copy user and backendTokens from token to session
      if (token.user) {
        session.user = {
          ...session.user,
          id: token.user.id,
          email: token.user.email,
          name: token.user.name,
          image: token.user.image,
          role: token.user.role,
          status: token.user.status,
        };
      }
      if (token.backendTokens) {
        (session as any).backendTokens = token.backendTokens;
      }
      if (token.error) {
        (session as any).error = token.error;
      }
      return session;
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
// ------------------------------------------------------------
