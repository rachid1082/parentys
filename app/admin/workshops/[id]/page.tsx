"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

interface WorkshopData {
  id?: string
  profile_id: string
  category_id: string
  title: string
  title_en: string
  title_fr: string
  title_ar: string
  description: string
  description_en: string
  description_fr: string
  description_ar: string
  status: string
  starts_at: string
  ends_at: string
  capacity: number
  price_cents: number
  currency: string
  banner_url: string
}

const defaultWorkshop: WorkshopData = {
  profile_id: "",
  category_id: "",
  title: "",
  title_en: "",
  title_fr: "",
  title_ar: "",
  description: "",
  description_en: "",
  description_fr: "",
  description_ar: "",
  status: "draft",
  starts_at: "",
  ends_at: "",
  capacity: 20,
  price_cents: 0,
  currency: "MAD",
  banner_url: "",
}

interface Expert {
  id: string
  profile_id: string
  profiles: { full_name: string | null } | null
}

interface Category {
  id: string
  label: string
}

export default function WorkshopEditPage() {
  const params = useParams()
  const router = useRouter()
  const workshopId = params.id as string
  const isNew = workshopId === "new"

  const [workshop, setWorkshop] = useState<WorkshopData>(defaultWorkshop)
  const [experts, setExperts] = useState<Expert[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      // Fetch experts with their profiles
      const { data: expertsData } = await supabase
        .from("experts")
        .select("id, profile_id, profiles(full_name)")
        .eq("status", "approved")

      if (expertsData) {
        setExperts(expertsData as Expert[])
      }

      // Fetch categories
      const { data: categoriesData } = await supabase.from("categories").select("id, label").order("label")

      if (categoriesData) {
        setCategories(categoriesData)
      }

      // Fetch workshop if editing
      if (!isNew) {
        const { data: workshopData } = await supabase.from("workshops").select("*").eq("id", workshopId).single()

        if (workshopData) {
          setWorkshop({
            ...defaultWorkshop,
            ...workshopData,
            starts_at: workshopData.starts_at ? workshopData.starts_at.slice(0, 16) : "",
            ends_at: workshopData.ends_at ? workshopData.ends_at.slice(0, 16) : "",
          })
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [workshopId, isNew, supabase])

  const handleSave = async () => {
    setSaving(true)
    setMessage("")

    const workshopPayload = {
      profile_id: workshop.profile_id || null,
      category_id: workshop.category_id || null,
      title: workshop.title,
      title_en: workshop.title_en,
      title_fr: workshop.title_fr,
      title_ar: workshop.title_ar,
      description: workshop.description,
      description_en: workshop.description_en,
      description_fr: workshop.description_fr,
      description_ar: workshop.description_ar,
      status: workshop.status,
      starts_at: workshop.starts_at ? new Date(workshop.starts_at).toISOString() : null,
      ends_at: workshop.ends_at ? new Date(workshop.ends_at).toISOString() : null,
      capacity: workshop.capacity,
      price_cents: workshop.price_cents,
      currency: workshop.currency,
      banner_url: workshop.banner_url,
      updated_at: new Date().toISOString(),
    }

    let error
    if (isNew) {
      const result = await supabase.from("workshops").insert(workshopPayload)
      error = result.error
    } else {
      const result = await supabase.from("workshops").update(workshopPayload).eq("id", workshopId)
      error = result.error
    }

    if (error) {
      setMessage("Error saving workshop: " + error.message)
    } else {
      setMessage("Workshop saved successfully")
      if (isNew) {
        router.push("/admin/workshops")
      }
    }
    setSaving(false)
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
          <div className="flex items-center gap-4">
            <Link href="/admin/workshops">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-3xl font-semibold text-[#333333]">
                {isNew ? "New Workshop" : "Edit Workshop"}
              </h1>
              <p className="text-muted-foreground mt-1">{workshop.title || "Untitled Workshop"}</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {isNew ? "Create Workshop" : "Save Changes"}
          </Button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Title (Multilingual)</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="default" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="default">Default</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="fr">French</TabsTrigger>
                    <TabsTrigger value="ar">Darija</TabsTrigger>
                  </TabsList>
                  <TabsContent value="default">
                    <Input
                      value={workshop.title}
                      onChange={(e) => setWorkshop({ ...workshop, title: e.target.value })}
                      placeholder="Default title..."
                    />
                  </TabsContent>
                  <TabsContent value="en">
                    <Input
                      value={workshop.title_en}
                      onChange={(e) => setWorkshop({ ...workshop, title_en: e.target.value })}
                      placeholder="English title..."
                    />
                  </TabsContent>
                  <TabsContent value="fr">
                    <Input
                      value={workshop.title_fr}
                      onChange={(e) => setWorkshop({ ...workshop, title_fr: e.target.value })}
                      placeholder="French title..."
                    />
                  </TabsContent>
                  <TabsContent value="ar">
                    <Input
                      value={workshop.title_ar}
                      onChange={(e) => setWorkshop({ ...workshop, title_ar: e.target.value })}
                      placeholder="Darija title..."
                      dir="rtl"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description (Multilingual)</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="default" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="default">Default</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="fr">French</TabsTrigger>
                    <TabsTrigger value="ar">Darija</TabsTrigger>
                  </TabsList>
                  <TabsContent value="default">
                    <Textarea
                      value={workshop.description}
                      onChange={(e) => setWorkshop({ ...workshop, description: e.target.value })}
                      placeholder="Default description..."
                      rows={4}
                    />
                  </TabsContent>
                  <TabsContent value="en">
                    <Textarea
                      value={workshop.description_en}
                      onChange={(e) => setWorkshop({ ...workshop, description_en: e.target.value })}
                      placeholder="English description..."
                      rows={4}
                    />
                  </TabsContent>
                  <TabsContent value="fr">
                    <Textarea
                      value={workshop.description_fr}
                      onChange={(e) => setWorkshop({ ...workshop, description_fr: e.target.value })}
                      placeholder="French description..."
                      rows={4}
                    />
                  </TabsContent>
                  <TabsContent value="ar">
                    <Textarea
                      value={workshop.description_ar}
                      onChange={(e) => setWorkshop({ ...workshop, description_ar: e.target.value })}
                      placeholder="Darija description..."
                      rows={4}
                      dir="rtl"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={workshop.starts_at}
                      onChange={(e) => setWorkshop({ ...workshop, starts_at: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={workshop.ends_at}
                      onChange={(e) => setWorkshop({ ...workshop, ends_at: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Capacity</Label>
                    <Input
                      type="number"
                      value={workshop.capacity}
                      onChange={(e) => setWorkshop({ ...workshop, capacity: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (in cents)</Label>
                    <Input
                      type="number"
                      value={workshop.price_cents}
                      onChange={(e) => setWorkshop({ ...workshop, price_cents: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={workshop.currency}
                      onValueChange={(value) => setWorkshop({ ...workshop, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MAD">MAD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Banner Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Banner URL</Label>
                  <Input
                    value={workshop.banner_url}
                    onChange={(e) => setWorkshop({ ...workshop, banner_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                {workshop.banner_url && (
                  <img
                    src={workshop.banner_url || "/placeholder.svg"}
                    alt="Banner preview"
                    className="h-32 object-cover rounded-lg"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={workshop.status} onValueChange={(value) => setWorkshop({ ...workshop, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expert</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={workshop.profile_id}
                  onValueChange={(value) => setWorkshop({ ...workshop, profile_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expert" />
                  </SelectTrigger>
                  <SelectContent>
                    {experts.map((expert) => (
                      <SelectItem key={expert.id} value={expert.profile_id}>
                        {expert.profiles?.full_name || "Unknown Expert"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={workshop.category_id}
                  onValueChange={(value) => setWorkshop({ ...workshop, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
