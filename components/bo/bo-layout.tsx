"use client"

import type React from "react"
import { useEffect, useState, createContext, useContext } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { type BOUser, isAdmin } from "@/lib/bo-auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck
} from "lucide-react"

interface BOLayoutProps {
  children: React.ReactNode
  adminOnly?: boolean
}

interface BOAuthContextType {
  user: BOUser | null
  isAdmin: boolean
}

const BOAuthContext = createContext<BOAuthContextType>({
  user: null,
  isAdmin: false,
})

export const useBOAuth = () => useContext(BOAuthContext)

const navItems = [
  { label: "Dashboard", href: "/bo", icon: LayoutDashboard, adminOnly: false },
  { label: "Users", href: "/bo/users", icon: Users, adminOnly: true },
  { label: "Experts", href: "/bo/experts", icon: ShieldCheck, adminOnly: false },
  { label: "Workshops", href: "/bo/workshops", icon: Calendar, adminOnly: false },
  { label: "Articles", href: "/bo/articles", icon: FileText, adminOnly: false },
]

export function BOLayout({ children, adminOnly = false }: BOLayoutProps) {
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [boUser, setBOUser] = useState<BOUser | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Wait for Supabase session to restore
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoadingAuth(false)
        router.push("/bo/login")
        return
      }

      // 2. Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, status, is_admin")
        .eq("user_id", user.id)
        .single()

      if (!profile || profile.status !== "approved") {
        setLoadingAuth(false)
        router.push("/bo/login")
        return
      }

      // 3. Admin validation
      if (profile.role === "admin" && !profile.is_admin) {
        setLoadingAuth(false)
        router.push("/bo/login")
        return
      }

      const currentUser: BOUser = {
        id: user.id,
        email: user.email || profile.email || "",
        profile_id: profile.id,
        full_name: profile.full_name,
        role: profile.role,
        status: profile.status,
        is_admin: profile.is_admin,
      }

      // 4. Admin-only pages
      if (adminOnly && !isAdmin(currentUser)) {
        setLoadingAuth(false)
        router.push("/bo")
        return
      }

      setBOUser(currentUser)
      setLoadingAuth(false)
    }

    checkAuth()
  }, [router, supabase, adminOnly])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/bo/login")
  }

  // 🔥 NEW: Prevent redirect loop
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#878D73] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!boUser) return null

  const userIsAdmin = isAdmin(boUser)
  const filteredNavItems = navItems.filter(item => !item.adminOnly || userIsAdmin)

  return (
    <BOAuthContext.Provider value={{ user: boUser, isAdmin: userIsAdmin }}>
      {/* unchanged UI */}
      <div className="flex min-h-screen bg-[#F5F1E6]">
        {/* ... your sidebar and content ... */}
        <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </main>
      </div>
    </BOAuthContext.Provider>
  )
}
