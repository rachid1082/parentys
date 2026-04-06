"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const getRedirectUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/bo/reset`;
  }
  return `${process.env.NEXT_PUBLIC_SITE_URL}/bo/reset`;
};

export default function BOLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ⬅️ NEW: add "signup" mode
  const [mode, setMode] = useState<"login" | "forgot" | "signup">("login");

  useEffect(() => {
    console.log("---- LOGIN PAGE DEBUG ----");
    console.log("ENV SITE URL:", process.env.NEXT_PUBLIC_SITE_URL);
    console.log("ENV SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(
      "ENV SUPABASE ANON KEY (first 10 chars):",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10)
    );
  }, []);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (document.requestStorageAccess) {
        try {
          await document.requestStorageAccess();
          console.log("[LOGIN DEBUG] Storage access granted");
        } catch {
          console.log("[LOGIN DEBUG] Storage access denied");
        }
      }

      const redirectTo = getRedirectUrl();
      const supabase = createClient();

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

      console.log("[RESET EMAIL DEBUG] data:", data);
      console.log("[RESET EMAIL DEBUG] error:", error);

      console.error("[RESET EMAIL ERROR RAW]:", error);
      console.error("[RESET EMAIL ERROR DETAILS]:", {
        name: error?.name,
        message: error?.message,
        status: (error as any)?.status,
      });

      if (error) {
        setError("Failed to send recovery email.");
        setLoading(false);
        return;
      }

      setSuccess("A recovery email has been sent.");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to send recovery email.");
      setLoading(false);
    }
  };

  // ⬅️ NEW: handle sign‑up
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log("[SIGNUP DEBUG] data:", data);
      console.log("[SIGNUP DEBUG] error:", error);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSuccess("Account created. Check your email to confirm.");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to create account.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img
            src="https://tznhipxlrohslxbrdrnm.supabase.co/storage/v1/object/public/assets/brand/logo/main/Main%20Logo%20Parentys.jpg"
            alt="Parentys"
            className="h-12 mx-auto mb-4"
          />
          <CardTitle className="font-display text-2xl">
            {mode === "login" && "Back-Office Login"}
            {mode === "forgot" && "Reset Password"}
            {mode === "signup" && "Create Account"}
          </CardTitle>
          <CardDescription>
            {mode === "login" && "Sign in to access the Back-Office"}
            {mode === "forgot" && "Enter your email to receive a reset link"}
            {mode === "signup" && "Create a new Back-Office account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              if (mode === "forgot") return void handleForgotPassword(e);
              if (mode === "signup") return void handleSignup(e);
              e.preventDefault();
            }}
          >
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">{success}</div>
            )}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Processing..."
                : mode === "login"
                ? "Sign In"
                : mode === "forgot"
                ? "Send Reset Link"
                : "Create Account"}
            </Button>

            <div className="text-center space-y-2">
              {mode !== "signup" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                    setSuccess("");
                  }}
                  className="text-sm text-[#878D73] hover:underline block w-full"
                >
                  Don’t have an account? Sign up
                </button>
              )}

              {mode !== "login" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccess("");
                  }}
                  className="text-sm text-[#878D73] hover:underline block w-full"
                >
                  Back to login
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
