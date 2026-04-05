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
    const url = `${window.location.origin}/bo/reset`
    console.log("[LOGIN DEBUG] redirectTo (client):", url)
    return url
  }

  const fallback = `${process.env.NEXT_PUBLIC_SITE_URL}/bo/reset`
  console.log("[LOGIN DEBUG] redirectTo (server):", fallback)
  return fallback
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
    console.log("---- LOGIN PAGE DEBUG ----")
    console.log("ENV SITE URL:", process.env.NEXT_PUBLIC_SITE_URL)
    console.log("ENV SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("ENV SUPABASE ANON KEY (first 10 chars):", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10))
  }, [])

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const redirectTo = getRedirectUrl()
      console.log("[LOGIN DEBUG] Sending reset email with redirectTo:", redirectTo)

      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

      if (error) {
        console.error("[LOGIN DEBUG] resetPasswordForEmail ERROR:", error)
        setError("Failed to send recovery email.")
        setLoading(false)
        return
      }

      console.log("[LOGIN DEBUG] Recovery email sent successfully")
      setSuccess("A recovery email has been sent.")
      setLoading(false)
    } catch (err) {
      console.error("[LOGIN DEBUG] Unexpected error:", err)
      setError("Failed to send recovery email.")
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
          <form onSubmit={mode === "login" ? () => {} : handleForgotPassword} className="space-y-4">
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
                ? (mode === "login" ? "Signing in..." : "Sending...")
                : (mode === "login" ? "Sign In" : "Send Reset Link")}
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
