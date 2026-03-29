import { createClient } from "@/lib/supabase"

export type Permission = "manage_experts" | "manage_workshops" | "manage_articles" | "manage_categories" | "manage_homepage" | "manage_about" | "manage_quickpath" | "full_access"

export interface AdminUser {
  id: string
  email: string
  profile_id: string
  full_name: string | null
  permissions: Permission[]
}

export async function checkAdminAuth(): Promise<{ isAdmin: boolean; user: AdminUser | null }> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { isAdmin: false, user: null }
  }

  // Get profile linked to this auth user with approved status
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, status")
    .eq("user_id", user.id)
    .eq("status", "approved")
    .single()

  if (!profile) {
    return { isAdmin: false, user: null }
  }

  // Get permissions for this profile
  const { data: permissionsData } = await supabase
    .from("profile_permissions")
    .select("permission")
    .eq("profile_id", profile.id)

  const permissions = permissionsData?.map((p) => p.permission as Permission) || []

  // Must have at least one permission to access admin
  if (permissions.length === 0) {
    return { isAdmin: false, user: null }
  }

  return {
    isAdmin: true,
    user: {
      id: user.id,
      email: user.email || "",
      profile_id: profile.id,
      full_name: profile.full_name,
      permissions,
    },
  }
}

export function hasPermission(user: AdminUser | null, permission: Permission): boolean {
  if (!user) return false
  return user.permissions.includes("full_access") || user.permissions.includes(permission)
}
