"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FolderTree, GitBranch } from "lucide-react"

interface Stats {
  experts: number
  workshops: number
  categories: number
  quickpathSteps: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ experts: 0, workshops: 0, categories: 0, quickpathSteps: 0 })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const [expertsRes, workshopsRes, categoriesRes, stepsRes] = await Promise.all([
        supabase.from("experts").select("id", { count: "exact", head: true }),
        supabase.from("workshops").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("quickpath_steps").select("id", { count: "exact", head: true }),
      ])

      setStats({
        experts: expertsRes.count || 0,
        workshops: workshopsRes.count || 0,
        categories: categoriesRes.count || 0,
        quickpathSteps: stepsRes.count || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [supabase])

  const statCards = [
    { label: "Experts", value: stats.experts, icon: Users, color: "bg-[#878D73]" },
    { label: "Workshops", value: stats.workshops, icon: Calendar, color: "bg-[#D88071]" },
    { label: "Categories", value: stats.categories, icon: FolderTree, color: "bg-[#2A7165]" },
    { label: "QuickPath Steps", value: stats.quickpathSteps, icon: GitBranch, color: "bg-[#E8D0C2]" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#333333]">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to the Parentys Back Office</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#333333]">{loading ? "..." : stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Use the sidebar to navigate to different sections of the back office. You can manage homepage content,
              experts, workshops, categories, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
