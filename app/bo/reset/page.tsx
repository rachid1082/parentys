"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const emailRedirectTo = process.env.NEXT_PUBLIC_SITE_URL + "/bo/login"

export default function BORegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"admin" | "expert">("expert")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
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

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            role: role, // Pass role in user metadata for the trigger
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message || "Failed to create account.")
        setSuccess("")
        setLoading(false)
        return
      }

      setSuccess(
        "Account created! Please check your email to confirm your registration. Your account will need admin approval before you can access the Back-Office.",
      )
      setError("")
      setLoading(false)

      setTimeout(() => {
        router.push("/bo/login")
      }, 4000)
    } catch (err) {
      setError("An error occurred. Please try again.")
      setSuccess("")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img
            src="https://eemnjizfrqobmcbcmwjf.supabase.co/storage/v1/object/public/assets/brand/logo/main/Main%20Logo%20Parentys.jpg"
            alt="Parentys"
            className="h-12 mx-auto mb-4"
          />
          <CardTitle className="font-display text-2xl">Create Account</CardTitle>
          <CardDescription>Sign up for Back-Office access</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
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
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: "admin" | "expert") => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expert">Expert</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {role === "admin"
                  ? "Admins can manage all users and content."
                  : "Experts can manage their own content."}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !!success}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
            <div className="text-center">
              <Link href="/bo/login" className="text-sm text-[#878D73] hover:underline">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
