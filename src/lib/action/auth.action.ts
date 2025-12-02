// "use server";
// import { cookies } from "next/headers";
// import api from "@/lib/api"; // your Axios or fetch wrapper
// import { parseStringify } from "@/lib/utils";

// //=====================================
// // LOGIN
// //=====================================
// export async function signIn({
//   email,
//   password,
// }: {
//   email: string;
//   password: string;
// }) {
//   try {
//     const response = await api.post("/auth/login", { email, password });
//     const token = response.data.token;
//     if (!token) throw new Error("No token returned from API");
//     // Save secure JWT
//     (await cookies()).set("auth_token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     });
//     return { success: true };
//   } catch (error) {
//     console.error("Sign-in Error:", error);
//     return { success: false, message: "Invalid credentials" };
//   }
// }
// //=====================================
// // REGISTER
// //=====================================
// export async function signUp(data: {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }) {
//   try {
//     const res = await api.post("/auth/register", data);
//     if (!res.data) throw new Error("Registration failed");

//     // Auto-login after register
//     const login = await signIn({ email: data.email, password: data.password });

//     return parseStringify({ success: true, user: res.data, login });
//   } catch (error) {
//     console.error("Sign-Up Error:", error);
//     return { success: false, message: "Failed to register" };
//   }
// }

// //=====================================
// // LOGOUT
// //=====================================
// export async function logoutAccount() {
//   try {
//     (await cookies()).delete("auth_token");
//     return { success: true };
//   } catch (error) {
//     console.error("Logout Error:", error);
//     return { success: false };
//   }
// }

// //=====================================
// // GET LOGGED-IN USER
// //=====================================
// export async function getLoggedInUser() {
//   try {
//     const token = (await cookies()).get("auth_token")?.value;
//     if (!token) return null;

//     const res = await api.get("/auth/profile", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     return parseStringify(res.data);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return null;
//   }
// }
