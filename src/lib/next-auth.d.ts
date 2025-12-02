// types/next-auth.d.ts
import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Define token structure
interface BackendTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Define user structure
interface CustomUser {
  id: string | number;
  email: string;
  name?: string;
  image?: string;
  role?: string;
  status?: string;
}

declare module "next-auth" {
  interface User extends CustomUser {
    backendTokens: BackendTokens;
  }

  interface Session extends DefaultSession {
    user?: CustomUser;
    backendTokens?: BackendTokens;
    error?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: CustomUser;
    backendTokens?: BackendTokens;
    error?: string | null;
  }
}