"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type Profile = {
  id: string
  full_name: string | null
  email: string | null
  role: string
  status: string
  is_admin: boolean
}

export default function BOLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [checkingSession, setCheckingSession] = useState(true)
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState<Profile | null>(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. On mount: check if there is an existing approved profile.
  //    IMPORTANT: we DO NOT auto-redirect to /bo here to avoid loops.
  useEffect(() => {
    let cancelled = false

    const checkExistingSession = async () => {
      try {
        console.log("[BO LOGIN] Checking existing session…")
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          console.log("[BO LOGIN] No user → stay on login")
          if (!cancelled) setCheckingSession(false)
          return
        }

        console.log("[BO LOGIN] User already logged in:", user.id)

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, email, role, status, is_admin")
          .eq("user_id", user.id)
          .single<Profile>()

        if (profileError || !profile) {
          console.log("[BO LOGIN] No profile or error → stay on login", profileError)
          if (!cancelled) setCheckingSession(false)
          return
        }

        if (profile.status !== "approved") {
          console.log("[BO LOGIN] Profile not approved → stay on login")
          if (!cancelled) setCheckingSession(false)
          return
        }

        console.log("[BO LOGIN] Profile approved → user is effectively logged in")
        if (!cancelled) {
          setAlreadyLoggedIn(profile)
          setCheckingSession(false)
        }
      } catch (e) {
        console.error("[BO LOGIN] Error while checking session", e)
        if (!cancelled) setCheckingSession(false)
      }
    }

    checkExistingSession()

    return () => {
      cancelled = true
    }
  }, [supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("[BO LOGIN] signIn error", signInError)
        setError(signInError.message || "Login failed")
        setLoading(false)
        return
      }

      if (!data.user) {
        setError("Login failed: no user returned")
        setLoading(false)
        return
      }

      // Fetch profile and ensure approved
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, status, is_admin")
        .eq("user_id", data.user.id)
        .single<Profile>()

      if (profileError || !profile) {
        console.error("[BO LOGIN] Profile fetch error", profileError)
        setError("Unable to load your profile")
        setLoading(false)
        return
      }

      if (profile.status !== "approved") {
        setError("Your profile is not approved yet.")
        setLoading(false)
        return
      }

      console.log("[BO LOGIN] Login successful & profile approved → go to /bo")
      router.replace("/bo")
    } catch (e: any) {
      console.error("[BO LOGIN] Unexpected error", e)
      setError(e?.message || "Unexpected error during login")
      setLoading(false)
    }
  }

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
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-display text-center">
            Parentys Back-Office
          </CardTitle>
          {alreadyLoggedIn && (
            <p className="text-xs text-center text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
              You are already logged in as{" "}
              <span className="font-semibold">
                {alreadyLoggedIn.full_name || alreadyLoggedIn.email}
              </span>
              .<br />
              You can go directly to your dashboard.
            </p>
          )}
        </CardHeader>
        <CardContent>
          {alreadyLoggedIn && (
            <div className="mb-4">
              <Button
                type="button"
                className="w-full mb-4"
                onClick={() => router.replace("/bo")}
              >
                Go to dashboard
              </Button>
              <div className="flex items-center justify-center mb-2">
                <span className="text-xs text-muted-foreground">
                  Or login with another account:
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </p>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in…" : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
