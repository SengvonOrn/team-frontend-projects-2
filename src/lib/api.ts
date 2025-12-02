import axios, { AxiosInstance } from "axios";
import { getSession } from "next-auth/react";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",

  withCredentials: true,
});
//======================
// Add token to requests
//======================
api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session && (session as any).backendTokens?.accessToken) {
    config.headers.Authorization = `Bearer ${
      (session as any).backendTokens.accessToken
    }`;
  }

  return config;
});
//=====================
// Handle 401 responses
//=====================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, sign out
      const { signOut } = await import("next-auth/react");
      await signOut({ redirect: true, callbackUrl: "/login" });
    }

    return Promise.reject(error);
  }
);

export default api;
