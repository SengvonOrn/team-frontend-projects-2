// "use server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { db, User } from "@/lib/db";
// const JWT_SECRET = process.env.JWT_SECRET!;

// interface SignUpInput {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
// }

// interface SignUpOutput {
//   success: boolean;
//   token?: string;
//   user?: User;
//   message?: string;
//   error?: any;
// }

// export const signUp = async ({
//   email,
//   password,
//   firstName,
//   lastName,
// }: SignUpInput): Promise<SignUpOutput> => {
//   try {
//     const exists = await db.user.findUnique({ where: { email } });
//     if (exists) return { success: false, message: "Email already exists" };

//     const hashed = await bcrypt.hash(password, 10);

//     const newUser = await db.user.create({
//       data: { email, password: hashed, firstName, lastName },
//     });

//     const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "7d" });

//     return { success: true, token, user: newUser };
//   } catch (error) {
//     console.error("Signup Error:", error);
//     return { success: false, error };
//   }
// };
