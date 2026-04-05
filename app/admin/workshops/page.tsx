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
import { Loader2, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react"

interface Workshop {
  id: string
  title: string | null
  status: string
  starts_at: string | null
  capacity: number | null
  price_cents: number | null
  currency: string | null
  created_at: string
}

export default function WorkshopsListPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchWorkshops = async () => {
    const { data } = await supabase
      .from("workshops")
      .select("id, title, status, starts_at, capacity, price_cents, currency, created_at")
      .order("created_at", { ascending: false })

    if (data) {
      setWorkshops(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWorkshops()
  }, [])

  const deleteWorkshop = async (id: string) => {
    if (confirm("Are you sure you want to delete this workshop?")) {
      await supabase.from("workshops").delete().eq("id", id)
      fetchWorkshops()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-[#2A7165] text-white">Published</Badge>
      case "archived":
        return <Badge variant="secondary">Archived</Badge>
      case "pending_review":
        return <Badge className="bg-[#D88071] text-white">Pending Review</Badge>
      case "draft":
      default:
        return <Badge className="bg-[#E8D0C2] text-[#333333]">Draft</Badge>
    }
  }

  const formatPrice = (cents: number | null, currency: string | null) => {
    if (!cents) return "Free"
    const amount = cents / 100
    return `${amount} ${currency || "MAD"}`
  }

  const formatDate = (date: string | null) => {
    if (!date) return "—"
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#333333]">Workshops</h1>
            <p className="text-muted-foreground mt-1">Manage workshops and sessions</p>
          </div>
          <Link href="/admin/workshops/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Workshop
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Workshops ({workshops.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workshops.map((workshop) => (
                  <TableRow key={workshop.id}>
                    <TableCell className="font-medium max-w-[250px] truncate">{workshop.title || "Untitled"}</TableCell>
                    <TableCell>{getStatusBadge(workshop.status)}</TableCell>
                    <TableCell>{formatDate(workshop.starts_at)}</TableCell>
                    <TableCell>{formatPrice(workshop.price_cents, workshop.currency)}</TableCell>
                    <TableCell>{workshop.capacity || "—"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/workshops/${workshop.id}`}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteWorkshop(workshop.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {workshops.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No workshops found
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
