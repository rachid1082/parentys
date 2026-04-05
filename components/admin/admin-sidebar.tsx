"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { LayoutDashboard, Home, Info, Users, UserCheck, Calendar, FolderTree, GitBranch, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Homepage Content", href: "/admin/homepage", icon: Home },
  { label: "About Page", href: "/admin/about", icon: Info },
  { label: "Users", href: "/admin/users", icon: UserCheck },
  { label: "Experts", href: "/admin/experts", icon: Users },
  { label: "Workshops", href: "/admin/workshops", icon: Calendar },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "QuickPath", href: "/admin/quickpath", icon: GitBranch },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-[#C9CEC0] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#C9CEC0]">
        <Link href="/admin">
          <img
            src="https://tznhipxlrohslxbrdrnm.supabase.co/storage/v1/object/public/assets/brand/logo/main/Main%20Logo%20Parentys.jpg"
            alt="Parentys Admin"
            className="h-10"
          />
        </Link>
        <p className="text-xs text-muted-foreground mt-2">Back Office</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive ? "bg-[#878D73] text-white" : "text-[#333333] hover:bg-[#F5F1E6]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#C9CEC0]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#333333] hover:bg-[#F5F1E6] w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
