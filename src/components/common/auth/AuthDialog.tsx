"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { Backend_URL } from "@/constants/ConstantsUrl";

type AuthModalProps = {
  type: "login" | "register";
  className?: string;
};

export default function AuthModal({ type, className }: AuthModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (type === "login") {
        // Credentials login
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          const errorMessage =
            res.error === "CredentialsSignin"
              ? "Invalid email or password."
              : `Login failed: ${res.error}`;
          setError(errorMessage);
          console.error("NextAuth Sign-in Error:", res.error);
        } else {
          console.log("Login Successful");
          setOpen(false);
          window.location.href = "/dashboard";
        }
      } else {
        // Register
        const registerRes = await fetch(`${Backend_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
          credentials: "include",
        });

        const data = await registerRes.json();

        if (!registerRes.ok) {
          setError(data.message || "Registration failed");
        } else {
          console.log("Registration successful!");
          setError("");
          setOpen(false);
          // Auto-login after registration
          const loginRes = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });

          if (!loginRes?.error) {
            window.location.href = "/dashboard";
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
      if (type === "register") {
        setName("");
        setEmail("");
        setPassword("");
      }
    }
  };
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      console.log("Starting Google sign-in with NextAuth");
      const result = await signIn("google", {
        redirect: true,
        callbackUrl: "/",
      });

      console.log("Google sign-in result:", result);
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`cursor-pointer ${className || ""}`}>
          {type === "login" ? "Login" : "Register"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogTitle className="text-xl font-semibold">
          {type === "login" ? "Login" : "Register"}
        </DialogTitle>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          {type === "register" && (
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? "Please wait..."
              : type === "login"
              ? "Login"
              : "Register"}
          </Button>
        </form>

        {type === "login" && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              {loading ? "Please wait..." : "Sign in with Google"}
            </Button>
          </>
        )}

        <DialogClose className="mt-4 cursor-pointer text-sm">Close</DialogClose>
      </DialogContent>
    </Dialog>
  );
}
