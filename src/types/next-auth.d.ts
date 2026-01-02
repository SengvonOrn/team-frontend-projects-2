import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role?: string;
      status?: string;
    };
    backendTokens?: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    error?: string;
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role?: string;
    status?: string;
    backendTokens?: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role?: string;
      status?: string;
    };
    backendTokens?: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    error?: string;
  }
}