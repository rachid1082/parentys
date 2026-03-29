"use client"

import type React from "react"

import { useEffect, useState, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { AdminSidebar } from "./admin-sidebar"
import type { AdminUser, Permission } from "@/lib/admin-auth"

interface AdminLayoutProps {
  children: React.ReactNode
}

interface AdminContextType {
  user: AdminUser | null
  hasPermission: (permission: Permission) => boolean
}

const AdminContext = createContext<AdminContextType>({
  user: null,
  hasPermission: () => false,
})

export const useAdmin = () => useContext(AdminContext)

export function AdminLayout({ children }: AdminLayoutProps) {
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/admin/login")
        return
      }

      // Check for approved profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, status")
        .eq("user_id", user.id)
        .eq("status", "approved")
        .single()

      if (!profile) {
        router.push("/")
        return
      }

      // Check permissions
      const { data: permissionsData } = await supabase
        .from("profile_permissions")
        .select("permission")
        .eq("profile_id", profile.id)

      const permissions = permissionsData?.map((p) => p.permission as Permission) || []

      if (permissions.length === 0) {
        router.push("/")
        return
      }

      setAdminUser({
        id: user.id,
        email: user.email || "",
        profile_id: profile.id,
        full_name: profile.full_name,
        permissions,
      })
      setLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const hasPermission = (permission: Permission): boolean => {
    if (!adminUser) return false
    return adminUser.permissions.includes("full_access") || adminUser.permissions.includes(permission)
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

  if (!adminUser) {
    return null
  }

  return (
    <AdminContext.Provider value={{ user: adminUser, hasPermission }}>
      <div className="flex min-h-screen bg-[#F5F1E6]">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </AdminContext.Provider>
  )
}
