"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { BOLayout, useBOAuth } from "@/components/bo/bo-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, Clock } from "lucide-react"

export default function BODashboardPage() {
  return (
    <BOLayout>
      <DashboardContent />
    </BOLayout>
  )
}

function DashboardContent() {
  const { user, isAdmin } = useBOAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalWorkshops: 0,
    totalExperts: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch counts
      const [profilesRes, workshopsRes, expertsRes] = await Promise.all([
        supabase.from("profiles").select("id, status", { count: "exact" }),
        supabase.from("workshops").select("id", { count: "exact" }),
        supabase.from("experts").select("id", { count: "exact" }),
      ])

      const profiles = profilesRes.data || []
      const pendingCount = profiles.filter(p => p.status === "pending").length

      setStats({
        totalUsers: profilesRes.count || 0,
        pendingUsers: pendingCount,
        totalWorkshops: workshopsRes.count || 0,
        totalExperts: expertsRes.count || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#878D73] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-[#333333]">
          Welcome back, {user?.full_name || "User"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin 
            ? "Here's an overview of your Back-Office" 
            : "Manage your expert content"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isAdmin && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingUsers}</div>
                {stats.pendingUsers > 0 && (
                  <p className="text-xs text-yellow-600 mt-1">Requires attention</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Experts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExperts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workshops</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkshops}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isAdmin && stats.pendingUsers > 0 && (
              <a
                href="/bo/users"
                className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-full bg-yellow-100">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Review Pending Users</p>
                  <p className="text-sm text-muted-foreground">{stats.pendingUsers} users waiting</p>
                </div>
              </a>
            )}
            <a
              href="/bo/workshops"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-full bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Manage Workshops</p>
                <p className="text-sm text-muted-foreground">View and edit workshops</p>
              </div>
            </a>
            <a
              href="/bo/experts"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-full bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Manage Experts</p>
                <p className="text-sm text-muted-foreground">View expert profiles</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
