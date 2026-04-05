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

// Navigation items
const navItems = [
  { label: "Dashboard", href: "/bo", icon: LayoutDashboard, adminOnly: false },
  { label: "Users", href: "/bo/users", icon: Users, adminOnly: true },
  { label: "Experts", href: "/bo/experts", icon: ShieldCheck, adminOnly: false },
  { label: "Workshops", href: "/bo/workshops", icon: Calendar, adminOnly: false },
  { label: "Articles", href: "/bo/articles", icon: FileText, adminOnly: false },
]

export function BOLayout({ children, adminOnly = false }: BOLayoutProps) {
  const [loading, setLoading] = useState(true)
  const [boUser, setBOUser] = useState<BOUser | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/bo/login")
        return
      }

      // Get profile with role, status, is_admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, status, is_admin")
        .eq("user_id", user.id)
        .single()

      if (profileError || !profile) {
        router.push("/bo/login")
        return
      }

      if (profile.status !== "approved") {
        router.push("/bo/login")
        return
      }

      // For admin role, verify is_admin is true
      if (profile.role === "admin" && !profile.is_admin) {
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

      // Check admin-only pages
      if (adminOnly && !isAdmin(currentUser)) {
        router.push("/bo")
        return
      }

      setBOUser(currentUser)
      setLoading(false)
    }

    checkAuth()
  }, [router, supabase, adminOnly])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/bo/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#878D73] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!boUser) {
    return null
  }

  const userIsAdmin = isAdmin(boUser)
  const filteredNavItems = navItems.filter(item => !item.adminOnly || userIsAdmin)

  return (
    <BOAuthContext.Provider value={{ user: boUser, isAdmin: userIsAdmin }}>
      <div className="flex min-h-screen bg-[#F5F1E6]">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md lg:hidden"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b">
              <Link href="/bo" className="flex items-center gap-2">
                <img
                  src="https://tznhipxlrohslxbrdrnm.supabase.co/storage/v1/object/public/assets/brand/logo/main/Main%20Logo%20Parentys.jpg"
                  alt="Parentys"
                  className="h-8"
                />
                <span className="font-display font-semibold text-lg">Back-Office</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#878D73] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                    {item.adminOnly && (
                      <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* User info & logout */}
            <div className="p-4 border-t">
              <div className="mb-3 px-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {boUser.full_name || boUser.email}
                </p>
                <p className="text-xs text-gray-500 truncate">{boUser.email}</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    userIsAdmin 
                      ? "bg-purple-100 text-purple-700" 
                      : "bg-blue-100 text-blue-700"
                  )}>
                    {userIsAdmin ? "Admin" : "Expert"}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </main>
      </div>
    </BOAuthContext.Provider>
  )
}
