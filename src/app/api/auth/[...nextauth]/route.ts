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
        expiresIn: Date.now() + 20000,
      },
      user: token.user,
    };
  } catch (err) {
    console.error("Refresh token exception:", err);
    return { ...token, error: "RefreshTokenException" };
  }
}

//========================================
//========================================

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
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("signIn callback triggered");
      console.log("Account provider:", account?.provider);
      console.log("Profile:", profile);

      if (account?.provider === "google" && profile) {
        try {
          console.log("Calling backend Google callback");

          const backendUrl = `${Backend_URL}/api/auth/google/callback`;
          console.log("Backend URL:", backendUrl);

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

          console.log("Backend response status:", res.status);
          const data = await res.json();
          console.log("Backend response data:", data);

          if (!res.ok) {
            console.error("Backend returned error:", data);
            return false;
          }
          user.id = data.user.id.toString();
          user.email = data.user.email;
          user.name = data.user.name;
          user.image = data.user.image;
          (user as any).role = data.user.role;
          (user as any).status = data.user.status;
          (user as any).backendTokens = data.backendTokens;

          console.log("User updated, returning true");
          return true;
        } catch (err) {
          console.error("Google sign-in error:", err);
          return false;
        }
      }

      console.log("✅ Non-Google provider, returning true");
      return true;
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
