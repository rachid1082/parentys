"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminResetPage() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionValid, setSessionValid] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const initializeSession = async () => {
      // NEW: Supabase sends ?code=...
      const code = searchParams.get("code")

      if (!code) {
        setError("Invalid or missing recovery link. Please request a new password reset.")
        setInitializing(false)
        return
      }

      try {
        const supabase = createClient()

        // NEW: use the code directly
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          setError("Invalid or expired recovery link. Please request a new password reset.")
          setInitializing(false)
          return
        }

        setSessionValid(true)
        setInitializing(false)
      } catch (err) {
        setError("An error occurred while verifying your recovery link.")
        setInitializing(false)
      }
    }

    initializeSession()
  }, [searchParams])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError("Failed to update password. Please try again.")
        setSuccess("")
        setLoading(false)
        return
      }

      setSuccess("Password updated successfully. Redirecting to login...")
      setError("")
      setLoading(false)

      setTimeout(() => {
        router.push("/admin/login")
      }, 2000)
    } catch (err) {
      setError("An error occurred. Please try again.")
      setSuccess("")
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6] p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#878D73] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Verifying recovery link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!sessionValid) {
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
            <CardDescription>Unable to verify recovery link</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg mb-4">{error}</div>
            <Button
              className="w-full"
              onClick={() => router.push("/admin/login")}
            >
              Back to Login
            </Button>
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
          <CardTitle className="font-display text-2xl">Set New Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            {error ? (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
            ) : success ? (
              <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">{success}</div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !!success}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/admin/login")}
                className="text-sm text-[#878D73] hover:underline"
              >
                Back to login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
