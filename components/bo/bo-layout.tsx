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
      <div className="flex min-h-screen bg-[#F5F1E6]">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b z-50 flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="font-display font-semibold text-[#333333]">Parentys BO</span>
          <div className="w-10" />
        </div>

        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r flex flex-col transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Logo */}
          <div className="h-14 flex items-center px-6 border-b">
            <Link href="/bo" className="font-display font-semibold text-xl text-[#333333]">
              Parentys BO
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/bo" && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#878D73] text-white"
                      : "text-[#333333] hover:bg-[#F5F1E6]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-[#C9CEC0] flex items-center justify-center text-[#333333] font-medium">
                {boUser.full_name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#333333] truncate">
                  {boUser.full_name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {boUser.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </main>
      </div>
    </BOAuthContext.Provider>
  )
}
