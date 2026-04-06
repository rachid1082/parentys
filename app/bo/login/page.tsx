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

// Use window.location.origin for preview environments, fallback to env var for production
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

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        // Check profile status
        const { data: profile } = await supabase
          .from("profiles")
          .select("status, role, is_admin")
          .eq("user_id", user.id)
          .single()

        if (profile?.status === "approved") {
          router.push("/bo")
        }
      }
    }
    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const supabase = createClient()

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError("Invalid email or password")
        setSuccess("")
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError("Authentication failed")
        setSuccess("")
        setLoading(false)
        return
      }

      // Check profile exists and is approved
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, status, role, is_admin")
        .eq("user_id", authData.user.id)
        .single()

      if (profileError || !profile) {
        await supabase.auth.signOut()
        setError("No profile found. Please contact an administrator.")
        setSuccess("")
        setLoading(false)
        return
      }

      if (profile.status !== "approved") {
        await supabase.auth.signOut()
        setError(`Access denied. Your profile status is "${profile.status}". Please wait for admin approval.`)
        setSuccess("")
        setLoading(false)
        return
      }

      // For admin role, verify is_admin is true
      if (profile.role === "admin" && !profile.is_admin) {
        await supabase.auth.signOut()
        setError("Access denied. Admin privileges not granted.")
        setSuccess("")
        setLoading(false)
        return
      }

      // Success - redirect to BO
      router.push("/bo")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again."
      setError(errorMessage)
      setSuccess("")
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // PKCE / Firefox storage access safeguard
      if (typeof document !== "undefined" && (document as any).requestStorageAccess) {
        try {
          await (document as any).requestStorageAccess()
          console.log("[LOGIN] Storage access granted before resetPasswordForEmail")
        } catch {
          console.log("[LOGIN] Storage access denied before resetPasswordForEmail")
        }
      }

      const redirectTo = getRedirectUrl()
      console.log("[v0] Reset password redirectTo:", redirectTo)
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

      if (resetError) {
        console.error("[RESET EMAIL ERROR]", resetError)
        setError("Failed to send recovery email.")
        setSuccess("")
        setLoading(false)
        return
      }

      setSuccess("A recovery email has been sent.")
      setError("")
      setLoading(false)
    } catch (err) {
      console.error("[RESET EMAIL EXCEPTION]", err)
      setError("Failed to send recovery email.")
      setSuccess("")
      setLoading(false)
    }
  }

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
            {error ? (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
            ) : success ? (
              <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">{success}</div>
            ) : null}
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
