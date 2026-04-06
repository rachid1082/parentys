"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const getRedirectUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/bo/reset`
  }
  return `${process.env.NEXT_PUBLIC_SITE_URL || ""}/bo/reset`
}

export default function BOLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<"login" | "forgot">("login")
  const router = useRouter()

  // ---------------------------------------------------------
  // 🔥 GLOBAL LOGGING HELPERS
  // ---------------------------------------------------------
  const log = (...args: any[]) => console.log("[BO LOGIN]", ...args)

  useEffect(() => {
    const checkAuth = async () => {
      log("=== PAGE LOAD ===")
      log("Cookies at load:", document.cookie)

      // -----------------------------------------------------
      // 🔥 1. REQUEST STORAGE ACCESS
      // -----------------------------------------------------
      if (typeof document !== "undefined" && (document as any).requestStorageAccess) {
        log("requestStorageAccess() available, calling it…")
        try {
          await (document as any).requestStorageAccess()
          log("requestStorageAccess() SUCCESS")
        } catch (err) {
          log("requestStorageAccess() FAILED:", err)
        }

        // tiny delay
        await new Promise((r) => setTimeout(r, 50))
        log("Cookies after storage access:", document.cookie)
      } else {
        log("requestStorageAccess() NOT available")
      }

      // -----------------------------------------------------
      // 🔥 2. CREATE SUPABASE CLIENT
      // -----------------------------------------------------
      log("Creating Supabase client…")
      const supabase = createClient()

      // -----------------------------------------------------
      // 🔥 3. CHECK USER SESSION
      // -----------------------------------------------------
      log("Calling supabase.auth.getUser()…")
      const userRes = await supabase.auth.getUser()
      log("auth.getUser() result:", userRes)

      const user = userRes.data.user

      if (!user) {
        log("NO USER FOUND — cannot fetch profile")
        return
      }

      log("User found:", user.id)

      // -----------------------------------------------------
      // 🔥 4. FETCH PROFILE
      // -----------------------------------------------------
      log("Fetching profile for user:", user.id)
      const profileRes = await supabase
        .from("profiles")
        .select("status, role, is_admin")
        .eq("user_id", user.id)
        .single()

      log("Profile fetch result:", profileRes)

      if (profileRes.error) {
        log("PROFILE ERROR:", profileRes.error)
      }

      if (profileRes.data?.status === "approved") {
        log("Profile approved → redirecting to /bo")
        router.push("/bo")
      } else {
        log("Profile not approved or missing")
      }
    }

    checkAuth()
  }, [router])

  // ---------------------------------------------------------
  // 🔥 LOGIN HANDLER WITH FULL LOGGING
  // ---------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    log("=== LOGIN SUBMIT ===")
    log("Email:", email)

    try {
      if (typeof document !== "undefined" && (document as any).requestStorageAccess) {
        log("requestStorageAccess() before login…")
        try {
          await (document as any).requestStorageAccess()
          log("requestStorageAccess() SUCCESS (login)")
        } catch (err) {
          log("requestStorageAccess() FAILED (login):", err)
        }

        await new Promise((r) => setTimeout(r, 50))
        log("Cookies after storage access (login):", document.cookie)
      }

      log("Creating Supabase client (login)…")
      const supabase = createClient()

      log("Calling signInWithPassword()…")
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      log("signInWithPassword() result:", { authData, authError })

      if (authError) {
        setError("Invalid email or password")
        setLoading(false)
        return
      }

      log("User authenticated:", authData.user.id)
      log("Cookies after login:", document.cookie)

      // -----------------------------------------------------
      // 🔥 FETCH PROFILE AFTER LOGIN
      // -----------------------------------------------------
      log("Fetching profile after login…")
      const profileRes = await supabase
        .from("profiles")
        .select("id, status, role, is_admin")
        .eq("user_id", authData.user.id)
        .single()

      log("Profile fetch result:", profileRes)

      if (!profileRes.data) {
        log("NO PROFILE FOUND")
        await supabase.auth.signOut()
        setError("No profile found. Please contact an administrator.")
        setLoading(false)
        return
      }

      if (profileRes.data.status !== "approved") {
        log("PROFILE NOT APPROVED:", profileRes.data.status)
        await supabase.auth.signOut()
        setError(`Access denied. Your profile status is "${profileRes.data.status}".`)
        setLoading(false)
        return
      }

      log("PROFILE APPROVED → redirecting to /bo")
      router.push("/bo")
    } catch (err) {
      log("LOGIN ERROR:", err)
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  // ---------------------------------------------------------
  // 🔥 FORGOT PASSWORD WITH LOGGING
  // ---------------------------------------------------------
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    log("=== FORGOT PASSWORD SUBMIT ===")

    try {
      if (typeof document !== "undefined" && (document as any).requestStorageAccess) {
        log("requestStorageAccess() before reset…")
        try {
          await (document as any).requestStorageAccess()
          log("requestStorageAccess() SUCCESS (reset)")
        } catch (err) {
          log("requestStorageAccess() FAILED (reset):", err)
        }

        await new Promise((r) => setTimeout(r, 50))
        log("Cookies after storage access (reset):", document.cookie)
      }

      const redirectTo = getRedirectUrl()
      log("Reset redirect URL:", redirectTo)

      const supabase = createClient()
      log("Calling resetPasswordForEmail()…")

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

      log("resetPasswordForEmail() result:", resetError)

      if (resetError) {
        setError("Failed to send recovery email.")
        setLoading(false)
        return
      }

      setSuccess("A recovery email has been sent.")
      setLoading(false)
    } catch (err) {
      log("RESET ERROR:", err)
      setError("Failed to send recovery email.")
      setLoading(false)
    }
  }

  // ---------------------------------------------------------
  // 🔥 UI (unchanged)
  // ---------------------------------------------------------
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
            {mode === "login" ? "Back-Office Login" : "Reset Password"}
          </CardTitle>
          <CardDescription>
            {mode === "login" ? "Sign in to access the Back-Office" : "Enter your email to receive a reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={mode === "login" ? handleLogin : handleForgotPassword} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
            {success && <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">{success}</div>}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {mode === "login" && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? mode === "login"
                  ? "Signing in..."
                  : "Sending..."
                : mode === "login"
                ? "Sign In"
                : "Send Reset Link"}
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "forgot" : "login")
                  setError("")
                  setSuccess("")
                }}
                className="text-sm text-[#878D73] hover:underline block w-full"
              >
                {mode === "login" ? "Forgot your password?" : "Back to login"}
              </button>

              {mode === "login" && (
                <Link href="/bo/register" className="text-sm text-[#878D73] hover:underline block">
                  Don&apos;t have an account? Sign up
                </Link>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
