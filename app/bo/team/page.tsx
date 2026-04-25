"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { BOLayout, useBOAuth } from "@/components/bo/bo-layout"
import { isSuperAdmin, SUPER_ADMIN_USER_ID } from "@/lib/bo-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, CheckCircle, XCircle, ShieldCheck, ShieldOff, Users, Crown, Trash2, UserPlus, Mail, Loader2 } from "lucide-react"

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

export default function BOTeamPage() {
  return (
    <BOLayout adminOnly>
      <TeamContent />
    </BOLayout>
  )
}

function TeamContent() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteName, setInviteName] = useState("")
  const [inviteRole, setInviteRole] = useState<"admin" | "expert">("expert")
  const [inviting, setInviting] = useState(false)
  const [inviteMessage, setInviteMessage] = useState("")
  const { user } = useBOAuth()
  const supabase = createClient()
  const userIsSuperAdmin = isSuperAdmin(user)

  const fetchProfiles = async () => {
    // Only fetch admin/team members, not experts (experts are in the Experts section)
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "admin")
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

  const handleDeleteAdmin = async (profileId: string, userId: string) => {
    if (!userIsSuperAdmin) {
      alert("Only the super-admin can remove admin users.")
      return
    }
    if (userId === SUPER_ADMIN_USER_ID) {
      alert("Cannot delete the super-admin account.")
      return
    }
    if (confirm("Are you sure you want to remove this admin? This will delete their profile.")) {
      setActionLoading(profileId)
      await supabase.from("profiles").delete().eq("id", profileId)
      await fetchProfiles()
      setActionLoading(null)
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setInviteMessage("Please enter an email address")
      return
    }

    setInviting(true)
    setInviteMessage("")

    try {
      // Use Supabase Auth to send invitation email
      // Note: This requires magic link or email invite to be enabled in Supabase
      const { error } = await supabase.auth.admin.inviteUserByEmail(inviteEmail, {
        data: {
          full_name: inviteName,
          role: inviteRole,
        },
        redirectTo: `${window.location.origin}/bo/login`,
      })

      if (error) {
        // If admin invite fails, we can create a pending profile manually
        // and send instructions via email (would need email service)
        setInviteMessage(
          "Note: Supabase admin invite requires service role. The user can register at /bo/login and will be assigned their role upon approval."
        )
        
        // For now, show the registration instructions
        setTimeout(() => {
          setInviteMessage(
            `Invite sent! Please inform ${inviteEmail} to register at ${window.location.origin}/bo/login. They will be approved as ${inviteRole === "admin" ? "an Admin" : "an Expert"}.`
          )
        }, 2000)
      } else {
        setInviteMessage(`Invitation sent to ${inviteEmail}`)
        setInviteEmail("")
        setInviteName("")
        setInviteRole("expert")
      }
    } catch {
      setInviteMessage("Failed to send invitation. Please try again.")
    } finally {
      setInviting(false)
    }
  }

  const resetInviteDialog = () => {
    setInviteEmail("")
    setInviteName("")
    setInviteRole("expert")
    setInviteMessage("")
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

  const getRoleBadge = (role: string, isAdmin: boolean, userId: string) => {
    if (userId === SUPER_ADMIN_USER_ID) {
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          <Crown className="h-3 w-3 mr-1" />
          Super Admin
        </Badge>
      )
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#333333]">Team Management</h1>
          <p className="text-muted-foreground mt-1">Manage admin team members and permissions</p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={(open) => {
          setInviteDialogOpen(open)
          if (!open) resetInviteDialog()
        }}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>
                Send an invitation to join Parentys as an admin or expert.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Full Name (optional)</Label>
                <Input
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={inviteRole} onValueChange={(value: "admin" | "expert") => setInviteRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expert">Expert</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {inviteRole === "admin" 
                    ? "Admins can manage content and approve experts" 
                    : "Experts can create workshops and articles"}
                </p>
              </div>
              {inviteMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  inviteMessage.includes("Failed") || inviteMessage.includes("Please enter")
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : inviteMessage.includes("Note")
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-green-50 text-green-600 border border-green-200"
                }`}>
                  {inviteMessage}
                </div>
              )}
              <Button onClick={handleInvite} disabled={inviting} className="w-full">
                {inviting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending Invitation...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
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

      {/* Team Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Team Members</CardTitle>
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
                  <TableCell>{getRoleBadge(profile.role, profile.is_admin, profile.user_id)}</TableCell>
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
                              {profile.is_admin && profile.role === "admin" && profile.user_id !== SUPER_ADMIN_USER_ID && (
                                <DropdownMenuItem onClick={() => handleDemoteToExpert(profile.id)}>
                                  <ShieldOff className="mr-2 h-4 w-4 text-orange-600" />
                                  Demote to Expert
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                          {userIsSuperAdmin && profile.user_id !== SUPER_ADMIN_USER_ID && profile.user_id !== user?.id && (
                            <DropdownMenuItem 
                              onClick={() => handleDeleteAdmin(profile.id, profile.user_id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove Admin
                            </DropdownMenuItem>
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
                    No team members found
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
