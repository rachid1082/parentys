"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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

  useEffect(() => {
    const initialize = async () => {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)

      const access_token = params.get("access_token")
      const refresh_token = params.get("refresh_token")
      const type = params.get("type")

      if (!access_token || !refresh_token || type !== "recovery") {
        setError("Invalid or missing recovery link. Please request a new password reset.")
        setInitializing(false)
        return
      }

      const supabase = createClient()

      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })

      if (sessionError) {
        setError("Invalid or expired recovery link. Please request a new password reset.")
        setInitializing(false)
        return
      }

      setSessionValid(true)
      setInitializing(false)
    }

    initialize()
  }, [])

  const handleResetPassword = async (e) => {
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
    const supabase = createClient()

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      setError("Failed to update password. Please try again.")
      setLoading(false)
      return
    }

    setSuccess("Password updated successfully. Redirecting to login...")
    setLoading(false)

    setTimeout(() => router.push("/admin/login"), 2000)
  }

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6] p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-8 h-8 border-4 border-[#878D73] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Verifying recovery link...</p>
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
            <CardTitle className="font-display text-2xl">Reset Password</CardTitle>
            <CardDescription>Unable to verify recovery link</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg mb-4">{error}</div>
            <Button className="w-full" onClick={() => router.push("/admin/login")}>
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
          <CardTitle className="font-display text-2xl">Set New Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
            {success && <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">{success}</div>}

            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
