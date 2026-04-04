"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { BOLayout, useBOAuth } from "@/components/bo/bo-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle, XCircle, ShieldCheck, ShieldOff, Users } from "lucide-react"

interface Profile {
  id: string
  user_id: string
  email: string | null
  full_name: string | null
  role: "admin" | "expert"
  status: "pending" | "approved" | "rejected"
  is_admin: boolean
  created_at: string
}

export default function BOUsersPage() {
  return (
    <BOLayout adminOnly>
      <UsersContent />
    </BOLayout>
  )
}

function UsersContent() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { user } = useBOAuth()
  const supabase = createClient()

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) {
      setProfiles(data as Profile[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const handleApprove = async (profileId: string) => {
    setActionLoading(profileId)
    await supabase
      .from("profiles")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq("id", profileId)
    await fetchProfiles()
    setActionLoading(null)
  }

  const handleReject = async (profileId: string) => {
    setActionLoading(profileId)
    await supabase
      .from("profiles")
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .eq("id", profileId)
    await fetchProfiles()
    setActionLoading(null)
  }

  const handlePromoteToAdmin = async (profileId: string) => {
    setActionLoading(profileId)
    await supabase
      .from("profiles")
      .update({ role: "admin", is_admin: true, updated_at: new Date().toISOString() })
      .eq("id", profileId)
    await fetchProfiles()
    setActionLoading(null)
  }

  const handleDemoteToExpert = async (profileId: string) => {
    setActionLoading(profileId)
    await supabase
      .from("profiles")
      .update({ role: "expert", is_admin: false, updated_at: new Date().toISOString() })
      .eq("id", profileId)
    await fetchProfiles()
    setActionLoading(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
    }
  }

  const getRoleBadge = (role: string, isAdmin: boolean) => {
    if (role === "admin" && isAdmin) {
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>
    }
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Expert</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#878D73] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const pendingCount = profiles.filter(p => p.status === "pending").length
  const approvedCount = profiles.filter(p => p.status === "approved").length
  const adminCount = profiles.filter(p => p.role === "admin" && p.is_admin).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-[#333333]">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <div className="h-4 w-4 rounded-full bg-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.email || "—"}</TableCell>
                  <TableCell>{profile.full_name || "—"}</TableCell>
                  <TableCell>{getRoleBadge(profile.role, profile.is_admin)}</TableCell>
                  <TableCell>{getStatusBadge(profile.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {profile.user_id !== user?.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={actionLoading === profile.id}
                          >
                            {actionLoading === profile.id ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {profile.status !== "approved" && (
                            <DropdownMenuItem onClick={() => handleApprove(profile.id)}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          {profile.status !== "rejected" && (
                            <DropdownMenuItem onClick={() => handleReject(profile.id)}>
                              <XCircle className="mr-2 h-4 w-4 text-red-600" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          {profile.status === "approved" && (
                            <>
                              {!profile.is_admin && (
                                <DropdownMenuItem onClick={() => handlePromoteToAdmin(profile.id)}>
                                  <ShieldCheck className="mr-2 h-4 w-4 text-purple-600" />
                                  Promote to Admin
                                </DropdownMenuItem>
                              )}
                              {profile.is_admin && profile.role === "admin" && (
                                <DropdownMenuItem onClick={() => handleDemoteToExpert(profile.id)}>
                                  <ShieldOff className="mr-2 h-4 w-4 text-orange-600" />
                                  Demote to Expert
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {profiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
