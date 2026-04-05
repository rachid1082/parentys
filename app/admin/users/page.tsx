"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { AdminLayout, useAdmin } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react"

interface Profile {
  id: string
  user_id: string
  full_name: string | null
  email: string | null
  status: string
  created_at: string
}

export default function UsersListPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClient()
  const { hasPermission } = useAdmin()

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, user_id, full_name, email, status, created_at")
      .order("created_at", { ascending: false })

    if (data) {
      setProfiles(data as Profile[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    await supabase
      .from("profiles")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
    await fetchProfiles()
    setUpdating(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-[#2A7165] text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge className="bg-[#E8D0C2] text-[#333333]">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#878D73]" />
        </div>
      </AdminLayout>
    )
  }

  // Check permission for managing users
  const canManageUsers = hasPermission("full_access")

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#333333]">Users</h1>
            <p className="text-muted-foreground mt-1">Manage user profiles and approvals</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({profiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  {canManageUsers && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#C9CEC0] flex items-center justify-center text-[#333333] font-medium">
                          {profile.full_name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="font-medium">{profile.full_name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{profile.email || "—"}</TableCell>
                    <TableCell>{getStatusBadge(profile.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(profile.created_at)}</TableCell>
                    {canManageUsers && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {profile.status !== "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[#2A7165] border-[#2A7165] hover:bg-[#2A7165] hover:text-white"
                              onClick={() => updateStatus(profile.id, "approved")}
                              disabled={updating === profile.id}
                            >
                              {updating === profile.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </>
                              )}
                            </Button>
                          )}
                          {profile.status !== "rejected" && profile.status !== "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                              onClick={() => updateStatus(profile.id, "pending")}
                              disabled={updating === profile.id}
                            >
                              {updating === profile.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Revoke
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {profiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={canManageUsers ? 5 : 4} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
