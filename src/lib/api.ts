// import axios, { AxiosInstance } from "axios";
// import { getSession } from "next-auth/react";

// const api: AxiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",

//   withCredentials: true,
// });
// //======================
// // Add token to requests
// //======================
// api.interceptors.request.use(async (config) => {
//   const session = await getSession();

//   if (session && (session as any).backendTokens?.accessToken) {
//     config.headers.Authorization = `Bearer ${
//       (session as any).backendTokens.accessToken
//     }`;
//   }

//   return config;
// });
// //=====================
// // Handle 401 responses
// //=====================
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Token expired, sign out
//       const { signOut } = await import("next-auth/react");
//       await signOut({ redirect: true, callbackUrl: "/login" });
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

//-------------------------------------------------------------
// export interface User {
//   id: number;
//   email: string;
//   name: string;
//   status: string;
//   role: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface LoginResponse {
//   accessToken: string;
//   user: User;
// }

// // Login function - calls Next.js API route
// export async function login(
//   email: string,
//   password: string
// ): Promise<LoginResponse> {
//   const response = await fetch("/api/auth/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email, password }),
//   });

//   if (!response.ok) {
//     throw new Error("Login failed");
//   }

//   return response.json();
// }

// // Get profile function - calls Next.js API route
// export async function getProfile(accessToken: string): Promise<User> {
//   const response = await fetch("/api/auth/profile", {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   if (!response.ok) {
//     throw new Error("Failed to fetch profile");
//   }

//   return response.json();
// }

// import { getSession } from "next-auth/react";

// export async function getAuthenticated(url: string, options: RequestInit = {}) {
//   const session = await getSession();
//   const token = (session as any)?.backendTokens?.accessToken;
//   if (!token) throw new Error("No access token found");
//   return fetch(url, {
//     ...options,
//     headers: {
//       ...(options.headers || {}),
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }

//==================================================================

class ApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error [${response.status}]:`, errorText);
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
