"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader2, MoreHorizontal, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react"

interface Expert {
  id: string
  profile_id: string
  headline: string | null
  bio: string | null
  categories: string[] | null
  status: string
  avatar_url: string | null
  created_at: string
  profiles: {
    full_name: string | null
    email: string | null
  } | null
}

export default function ExpertsListPage() {
  const [experts, setExperts] = useState<Expert[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchExperts = async () => {
    const { data } = await supabase
      .from("experts")
      .select(`
        id,
        profile_id,
        headline,
        bio,
        categories,
        status,
        avatar_url,
        created_at,
        profiles (
          full_name,
          email
        )
      `)
      .order("created_at", { ascending: false })

    if (data) {
      setExperts(data as Expert[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchExperts()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("experts").update({ status, updated_at: new Date().toISOString() }).eq("id", id)
    fetchExperts()
  }

  const deleteExpert = async (id: string) => {
    if (confirm("Are you sure you want to delete this expert?")) {
      await supabase.from("experts").delete().eq("id", id)
      fetchExperts()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-[#2A7165] text-white">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "pending":
      default:
        return <Badge className="bg-[#E8D0C2] text-[#333333]">Pending</Badge>
    }
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#333333]">Experts</h1>
            <p className="text-muted-foreground mt-1">Manage expert profiles and approvals</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Experts ({experts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expert</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Headline</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experts.map((expert) => (
                  <TableRow key={expert.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {expert.avatar_url ? (
                          <img
                            src={expert.avatar_url || "/placeholder.svg"}
                            alt={expert.profiles?.full_name || "Expert"}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[#C9CEC0] flex items-center justify-center text-[#333333] font-medium">
                            {expert.profiles?.full_name?.charAt(0) || "?"}
                          </div>
                        )}
                        <span className="font-medium">{expert.profiles?.full_name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{expert.profiles?.email || "—"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{expert.headline || "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {expert.categories?.slice(0, 2).map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                        {expert.categories && expert.categories.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{expert.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(expert.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/experts/${expert.id}`}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          {expert.status !== "approved" && (
                            <DropdownMenuItem onClick={() => updateStatus(expert.id, "approved")}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          {expert.status !== "rejected" && (
                            <DropdownMenuItem onClick={() => updateStatus(expert.id, "rejected")}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => deleteExpert(expert.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {experts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No experts found
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
