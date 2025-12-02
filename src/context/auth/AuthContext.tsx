// // frontend/context/AuthContext.tsx
// "use client";
// import {
//   createContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useContext,
// } from "react";
// import api, { setAuthToken } from "../../lib/api";
// import { User } from "../../types/user";

// type AuthContextType = {
//   user: User | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// };
// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   token: null,
//   login: async () => {},
//   logout: () => {},
// });
// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     if (savedToken) {
//       setToken(savedToken);
//       setAuthToken(savedToken);
//       fetchProfile(savedToken);
//       // setAuthToken(token);
//       // api.get<User>("/auth/profile")
//       // .then(res => setUser(res.data))
//       // .catch(()=> setUser(null));
//     }
//   }, []);

//   const fetchProfile = async (jwtToken: string) => {
//     try {
//       const res = await api.get("/auth/profile");
//       setUser(res.data);
//     } catch (err) {
//       logout();
//     }
//   };

//   const login = async (email: string, password: string) => {
//     const res = await api.post("/auth/login", { email, password });
//     const access_token = res.data.access_token;
//     setToken(access_token);
//     localStorage.setItem("token", access_token);
//     setAuthToken(access_token);
//     await fetchProfile(access_token);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//     setAuthToken(null);
//   };
//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
// export { AuthContext };

// "use client";

// import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// import api, { setAuthToken } from "@/lib/api";
// import { User } from "@/types/user";

// type AuthContextType = {
//   user: User | null;
//   login: (token: string) => Promise<void>;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   login: async () => {},
//   logout: () => {},
// });

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);

//   // Load token on page refresh
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       setAuthToken(token);
//       api
//         .get("/auth/profile")
//         .then((res) => setUser(res.data))
//         .catch(() => setUser(null));
//     }
//   }, []);

//   const login = async (token: string) => {
//     localStorage.setItem("token", token);
//     setAuthToken(token);

//     const res = await api.get("/auth/profile");
//     setUser(res.data);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setAuthToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

// "use client";

// import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// import api, { setAuthToken } from "@/lib/api";
// import { User } from "@/types/user";

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   login: (token: string) => Promise<void>;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   login: async () => {},
//   logout: () => {},
// });

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Load token on page refresh
//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     setAuthToken(token);

//     api
//       .get("/auth/profile")
//       .then((res) => setUser(res.data))
//       .catch(() => setUser(null))
//       .finally(() => setLoading(false));
//   }, []);

//   const login = async (token: string) => {
//     localStorage.setItem("token", token);
//     setAuthToken(token);

//     const res = await api.get("/auth/profile");
//     setUser(res.data);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setAuthToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

// "use client";
// import {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
// } from "react";
// import api, { setAuthToken } from "@/lib/api";
// import { User } from "@/types/user";

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   login: (token: string) => Promise<void>;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   login: async () => {},
//   logout: () => {},
// });

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true); // <-- FIXED

//   // Load token on refresh
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     setAuthToken(token);
//     api
//       .get("/auth/profile")
//       .then((res) => setUser(res.data))
//       .catch(() => setUser(null))
//       .finally(() => setLoading(false)); // <-- FIXED
//   }, []);

//   const login = async (token: string) => {
//     localStorage.setItem("token", token);
//     setAuthToken(token);

//     const res = await api.get("/auth/profile");
//     setUser(res.data);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setAuthToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);
