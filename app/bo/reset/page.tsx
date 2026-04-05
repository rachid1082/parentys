"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [validatingToken, setValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Extract PKCE token from hash fragment
        const hash = window.location.hash
        const params = new URLSearchParams(hash.replace("#", ""))

        const accessToken = params.get("access_token")
        const type = params.get("type")

        if (type !== "recovery" || !accessToken) {
          setError("Invalid reset link. Please request a new password reset.")
          setTokenValid(false)
          setValidatingToken(false)
          return
        }

        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(accessToken)

        if (error) {
          setError("Invalid or expired reset link. Please request a new one.")
          setTokenValid(false)
        } else {
          setTokenValid(true)
        }
      } catch {
        setError("Failed to validate reset link.")
        setTokenValid(false)
      }

      setValidatingToken(false)
    }

    validateToken()
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        setError(updateError.message || "Failed to update password.")
        setSuccess("")
        setLoading(false)
        return
      }

      setSuccess("Password updated successfully! Redirecting to login...")
      setError("")

      await supabase.auth.signOut()

      setTimeout(() => {
        router.push("/bo/login")
      }, 2000)
    } catch {
      setError("An error occurred. Please try again.")
      setSuccess("")
      setLoading(false)
    }
  }

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6] p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-[#878D73] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Validating reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
          <CardTitle className="font-display text-2xl">Reset Password</CardTitle>
          <CardDescription>
            {tokenValid ? "Enter your new password below" : "Unable to reset password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!tokenValid ? (
            <div className="space-y-4">
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
              <Button onClick={() => router.push("/bo/login")} className="w-full">
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {error ? (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
              ) : success ? (
                <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">{success}</div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  disabled={!!success}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  minLength={6}
                  disabled={!!success}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || !!success}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function BOResetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6] p-4">
          <div className="w-8 h-8 border-4 border-[#878D73] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
