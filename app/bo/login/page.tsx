"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const L = (...args: any[]) =>
  console.log(`[BO LOGIN][${new Date().toISOString()}]`, ...args)

export default function BOLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [checkingSession, setCheckingSession] = useState(true)

  // ---------------------------------------------------------
  // 🔥 1. CHECK IF USER IS ALREADY LOGGED IN
  // ---------------------------------------------------------
  useEffect(() => {
    const check = async () => {
      L("Checking existing session…")

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        L("No existing session → stay on login page")
        setCheckingSession(false)
        return
      }

      L("User already logged in:", user.id)

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("status, role, is_admin")
        .eq("user_id", user.id)
        .single()

      if (profile?.status === "approved") {
        L("Profile approved → redirecting to /bo")
        router.push("/bo")
        return
      }

      L("Profile not approved → stay on login page")
      setCheckingSession(false)
    }

    check()
  }, [router, supabase])

  // ---------------------------------------------------------
  // 🔥 2. LOGIN HANDLER
  // ---------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    L("Login attempt:", email)

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    L("signInWithPassword result:", { authData, authError })

    if (authError) {
      setError("Invalid email or password")
      setLoading(false)
      return
    }

    const user = authData.user
    L("Authenticated user:", user.id)

    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("status, role, is_admin")
      .eq("user_id", user.id)
      .single()

    L("Profile after login:", profile)

    if (!profile || profile.status !== "approved") {
      setError("Your account is not approved yet.")
      setLoading(false)
      return
    }

    L("Login successful → redirecting to /bo")
    router.push("/bo")
  }

  // ---------------------------------------------------------
  // 🔥 3. UI
  // ---------------------------------------------------------
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#878D73] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Checking session…</p>
        </div>
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
          <CardTitle className="font-display text-2xl">Back-Office Login</CardTitle>
          <CardDescription>Sign in to access the Back-Office</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
            {success && <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">{success}</div>}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
