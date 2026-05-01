import { createClient } from "@/lib/supabase"

// Hardcoded super-admin user ID - only this user can remove other admins
export const SUPER_ADMIN_USER_ID = "32ce58a9-e706-4ffd-88e4-fc61dcef8539"

export type Role = "admin" | "expert"
export type ProfileStatus = "pending" | "approved" | "rejected"

export interface BOUser {
  id: string
  email: string
  profile_id: string
  full_name: string | null
  role: Role
  status: ProfileStatus
  is_admin: boolean
}

export interface AuthResult {
  authenticated: boolean
  user: BOUser | null
  error?: string
}

/**
 * Check if the current user is authenticated and has access to the BO
 * Returns the user profile with role/status/is_admin
 */
export async function checkBOAuth(): Promise<AuthResult> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { authenticated: false, user: null, error: "Not authenticated" }
  }

  // Get profile with role, status, and is_admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, status, is_admin")
    .eq("user_id", user.id)
    .single()

  if (profileError || !profile) {
    return { 
      authenticated: false, 
      user: null, 
      error: "No profile found. Please contact an administrator." 
    }
  }

  if (profile.status !== "approved") {
    return { 
      authenticated: false, 
      user: null, 
      error: `Access denied. Your profile status is "${profile.status}". Please wait for admin approval.` 
    }
  }

  // For admin role, verify is_admin is true
  if (profile.role === "admin" && !profile.is_admin) {
    return { 
      authenticated: false, 
      user: null, 
      error: "Access denied. Admin privileges not granted." 
    }
  }

  return {
    authenticated: true,
    user: {
      id: user.id,
      email: user.email || profile.email || "",
      profile_id: profile.id,
      full_name: profile.full_name,
      role: profile.role as Role,
      status: profile.status as ProfileStatus,
      is_admin: profile.is_admin,
    },
  }
}

/**
 * Check if user is an approved admin
 */
export function isAdmin(user: BOUser | null): boolean {
  if (!user) return false
  return user.role === "admin" && user.is_admin === true && user.status === "approved"
}

/**
 * Check if user is an approved expert (or admin)
 */
export function isExpertOrAdmin(user: BOUser | null): boolean {
  if (!user) return false
  if (user.status !== "approved") return false
  return user.role === "admin" || user.role === "expert"
}

/**
 * Check if user is the super-admin (hardcoded)
 */
export function isSuperAdmin(user: BOUser | null): boolean {
  if (!user) return false
  return user.id === SUPER_ADMIN_USER_ID && isAdmin(user)
}
