"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { BOLayout, useBOAuth } from "@/components/bo/bo-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

interface ExpertData {
  id: string
  profile_id: string
  headline: string
  headline_en: string
  headline_fr: string
  headline_ar: string
  bio: string
  bio_en: string
  bio_fr: string
  bio_ar: string
  categories: string[]
  status: string
  avatar_url: string
}

interface Category {
  id: string
  slug: string
  label: string
}

export default function BOExpertEditPage() {
  return (
    <BOLayout>
      <ExpertEditContent />
    </BOLayout>
  )
}

function ExpertEditContent() {
  const params = useParams()
  const router = useRouter()
  const expertId = params.id as string
  const { isAdmin } = useBOAuth()

  const [expert, setExpert] = useState<ExpertData | null>(null)
  const [fullName, setFullName] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      // Fetch expert with profile
      const { data: expertData } = await supabase
        .from("experts")
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq("id", expertId)
        .single()

      if (expertData) {
        setExpert({
          id: expertData.id,
          profile_id: expertData.profile_id,
          headline: expertData.headline || "",
          headline_en: expertData.headline_en || "",
          headline_fr: expertData.headline_fr || "",
          headline_ar: expertData.headline_ar || "",
          bio: expertData.bio || "",
          bio_en: expertData.bio_en || "",
          bio_fr: expertData.bio_fr || "",
          bio_ar: expertData.bio_ar || "",
          categories: expertData.categories || [],
          status: expertData.status || "pending",
          avatar_url: expertData.avatar_url || "",
        })
        setSelectedCategories(expertData.categories || [])
        setFullName(expertData.profiles?.full_name || "")
      }

      // Fetch categories
      const { data: categoriesData } = await supabase.from("categories").select("id, slug, label").order("label")

      if (categoriesData) {
        setCategories(categoriesData)
      }

      setLoading(false)
    }

    fetchData()
  }, [expertId, supabase])

  const handleSave = async () => {
    if (!expert) return

    setSaving(true)
    setMessage("")

    // Update expert - categories are NOT editable by admins, only by experts themselves
    const { error: expertError } = await supabase
      .from("experts")
      .update({
        headline: expert.headline,
        headline_en: expert.headline_en,
        headline_fr: expert.headline_fr,
        headline_ar: expert.headline_ar,
        bio: expert.bio,
        bio_en: expert.bio_en,
        bio_fr: expert.bio_fr,
        bio_ar: expert.bio_ar,
        status: expert.status,
        avatar_url: expert.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", expertId)

    // Update profile full_name
    if (expert.profile_id) {
      await supabase.from("profiles").update({ full_name: fullName }).eq("id", expert.profile_id)
    }

    if (expertError) {
      setMessage("Error saving expert")
    } else {
      setMessage("Expert saved successfully")
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#878D73]" />
      </div>
    )
  }

  if (!expert) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Expert not found</p>
        <Link href="/bo/experts" className="text-[#878D73] hover:underline mt-2 inline-block">
          Back to experts
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/bo/experts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-[#333333]">Edit Expert</h1>
            <p className="text-muted-foreground mt-1">{fullName || "Unknown Expert"}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
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
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Avatar URL</Label>
                <Input
                  value={expert.avatar_url}
                  onChange={(e) => setExpert({ ...expert, avatar_url: e.target.value })}
                />
                {expert.avatar_url && (
                  <img
                    src={expert.avatar_url}
                    alt="Avatar"
                    className="mt-2 h-20 w-20 rounded-full object-cover"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Headline (Multilingual)</CardTitle>
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
                    value={expert.headline}
                    onChange={(e) => setExpert({ ...expert, headline: e.target.value })}
                    placeholder="Default headline..."
                  />
                </TabsContent>
                <TabsContent value="en">
                  <Input
                    value={expert.headline_en}
                    onChange={(e) => setExpert({ ...expert, headline_en: e.target.value })}
                    placeholder="English headline..."
                  />
                </TabsContent>
                <TabsContent value="fr">
                  <Input
                    value={expert.headline_fr}
                    onChange={(e) => setExpert({ ...expert, headline_fr: e.target.value })}
                    placeholder="French headline..."
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <Input
                    value={expert.headline_ar}
                    onChange={(e) => setExpert({ ...expert, headline_ar: e.target.value })}
                    placeholder="Darija headline..."
                    dir="rtl"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bio (Multilingual)</CardTitle>
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
                    value={expert.bio}
                    onChange={(e) => setExpert({ ...expert, bio: e.target.value })}
                    placeholder="Default bio..."
                    rows={4}
                  />
                </TabsContent>
                <TabsContent value="en">
                  <Textarea
                    value={expert.bio_en}
                    onChange={(e) => setExpert({ ...expert, bio_en: e.target.value })}
                    placeholder="English bio..."
                    rows={4}
                  />
                </TabsContent>
                <TabsContent value="fr">
                  <Textarea
                    value={expert.bio_fr}
                    onChange={(e) => setExpert({ ...expert, bio_fr: e.target.value })}
                    placeholder="French bio..."
                    rows={4}
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <Textarea
                    value={expert.bio_ar}
                    onChange={(e) => setExpert({ ...expert, bio_ar: e.target.value })}
                    placeholder="Darija bio..."
                    rows={4}
                    dir="rtl"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={expert.status} onValueChange={(value) => setExpert({ ...expert, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Categories are managed by the expert themselves and cannot be edited here.
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map((slug) => {
                    const category = categories.find((c) => c.slug === slug)
                    return (
                      <span
                        key={slug}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#C9CEC0] text-[#333333]"
                      >
                        {category?.label || slug}
                      </span>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No categories assigned</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
