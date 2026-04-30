"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { BOLayout, useBOAuth } from "@/components/bo/bo-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"

interface ArticleData {
  id?: string
  expert_id: string
  title: string
  title_en: string
  title_fr: string
  title_ar: string
  content: string
  content_en: string
  content_fr: string
  content_ar: string
  excerpt: string
  excerpt_en: string
  excerpt_fr: string
  excerpt_ar: string
  image_url: string
  status: string
}

const defaultArticle: ArticleData = {
  expert_id: "",
  title: "",
  title_en: "",
  title_fr: "",
  title_ar: "",
  content: "",
  content_en: "",
  content_fr: "",
  content_ar: "",
  excerpt: "",
  excerpt_en: "",
  excerpt_fr: "",
  excerpt_ar: "",
  image_url: "",
  status: "draft",
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

export default function BOArticleEditPage() {
  return (
    <BOLayout>
      <ArticleEditContent />
    </BOLayout>
  )
}

function ArticleEditContent() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string
  const isNew = articleId === "new"
  const { isAdmin, user } = useBOAuth()

  const [article, setArticle] = useState<ArticleData>(defaultArticle)
  const [experts, setExperts] = useState<Expert[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [currentExpertId, setCurrentExpertId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      // Get current user's expert ID if they are an expert
      if (user?.id) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .single()
        
        if (profileData) {
          const { data: expertData } = await supabase
            .from("experts")
            .select("id")
            .eq("profile_id", profileData.id)
            .single()
          
          if (expertData) {
            setCurrentExpertId(expertData.id)
            if (isNew) {
              setArticle((prev) => ({ ...prev, expert_id: expertData.id }))
            }
          }
        }
      }

      // Fetch experts with their profiles (for admins to assign)
      const { data: expertsData } = await supabase
        .from("experts")
        .select("id, profile_id, profiles(full_name)")
        .eq("status", "approved")

      if (expertsData) {
        setExperts(expertsData as Expert[])
      }

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("id, label")
        .order("order_index", { ascending: true })

      if (categoriesData) {
        setCategories(categoriesData)
      }

      // Fetch article if editing
      if (!isNew) {
        const { data: articleData } = await supabase
          .from("articles")
          .select("*")
          .eq("id", articleId)
          .single()

        if (articleData) {
          setArticle({
            ...defaultArticle,
            ...articleData,
          })
        }

        // Fetch article categories
        const { data: acData } = await supabase
          .from("article_categories")
          .select("category_id")
          .eq("article_id", articleId)

        if (acData) {
          setSelectedCategories(acData.map((ac) => ac.category_id))
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [articleId, isNew, supabase, user?.id])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSave = async () => {
    // Validate at least one category
    if (selectedCategories.length === 0) {
      setMessage("Please select at least one category")
      return
    }

    setSaving(true)
    setMessage("")

    const articlePayload = {
      expert_id: article.expert_id || currentExpertId || null,
      title: article.title,
      title_en: article.title_en || null,
      title_fr: article.title_fr || null,
      title_ar: article.title_ar || null,
      content: article.content,
      content_en: article.content_en || null,
      content_fr: article.content_fr || null,
      content_ar: article.content_ar || null,
      excerpt: article.excerpt || null,
      excerpt_en: article.excerpt_en || null,
      excerpt_fr: article.excerpt_fr || null,
      excerpt_ar: article.excerpt_ar || null,
      image_url: article.image_url || null,
      status: article.status,
      updated_at: new Date().toISOString(),
      published_at: article.status === "published" ? new Date().toISOString() : null,
    }

    let error
    let newArticleId = articleId

    if (isNew) {
      const result = await supabase.from("articles").insert(articlePayload).select("id").single()
      error = result.error
      if (result.data) {
        newArticleId = result.data.id
      }
    } else {
      const result = await supabase.from("articles").update(articlePayload).eq("id", articleId)
      error = result.error
    }

    if (error) {
      setMessage("Error saving article: " + error.message)
      setSaving(false)
      return
    }

    // Update article categories
    if (!isNew) {
      // Delete existing categories
      await supabase.from("article_categories").delete().eq("article_id", articleId)
    }

    // Insert new categories
    if (selectedCategories.length > 0 && newArticleId) {
      const categoryInserts = selectedCategories.map((categoryId) => ({
        article_id: newArticleId,
        category_id: categoryId,
      }))
      const { error: catError } = await supabase.from("article_categories").insert(categoryInserts)
      if (catError) {
        setMessage("Article saved but error saving categories: " + catError.message)
        setSaving(false)
        return
      }
    }

    // Show review notification for non-admin users submitting for review
    if (!isAdmin && article.status === "pending_review") {
      setMessage(
        "Article submitted for review! Our team will review your submission and you will be notified by email once approved."
      )
    } else {
      setMessage("Article saved successfully")
    }

    if (isNew) {
      setTimeout(() => router.push("/bo/articles"), 2000)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/bo/articles">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-[#333333]">
              {isNew ? "New Article" : "Edit Article"}
            </h1>
            <p className="text-muted-foreground mt-1">{article.title || "Untitled Article"}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {isNew ? "Create Article" : "Save Changes"}
        </Button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg text-sm ${
            message.includes("Error") || message.includes("Please select")
              ? "bg-red-50 text-red-600 border border-red-200"
              : message.includes("review")
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-green-50 text-green-600 border border-green-200"
          }`}
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
                    value={article.title}
                    onChange={(e) => setArticle({ ...article, title: e.target.value })}
                    placeholder="Default title..."
                  />
                </TabsContent>
                <TabsContent value="en">
                  <Input
                    value={article.title_en}
                    onChange={(e) => setArticle({ ...article, title_en: e.target.value })}
                    placeholder="English title..."
                  />
                </TabsContent>
                <TabsContent value="fr">
                  <Input
                    value={article.title_fr}
                    onChange={(e) => setArticle({ ...article, title_fr: e.target.value })}
                    placeholder="French title..."
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <Input
                    value={article.title_ar}
                    onChange={(e) => setArticle({ ...article, title_ar: e.target.value })}
                    placeholder="Darija title..."
                    dir="rtl"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Excerpt (Multilingual)</CardTitle>
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
                    value={article.excerpt}
                    onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                    placeholder="Short summary for previews..."
                    rows={2}
                  />
                </TabsContent>
                <TabsContent value="en">
                  <Textarea
                    value={article.excerpt_en}
                    onChange={(e) => setArticle({ ...article, excerpt_en: e.target.value })}
                    placeholder="English excerpt..."
                    rows={2}
                  />
                </TabsContent>
                <TabsContent value="fr">
                  <Textarea
                    value={article.excerpt_fr}
                    onChange={(e) => setArticle({ ...article, excerpt_fr: e.target.value })}
                    placeholder="French excerpt..."
                    rows={2}
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <Textarea
                    value={article.excerpt_ar}
                    onChange={(e) => setArticle({ ...article, excerpt_ar: e.target.value })}
                    placeholder="Darija excerpt..."
                    rows={2}
                    dir="rtl"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content (Multilingual)</CardTitle>
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
                    value={article.content}
                    onChange={(e) => setArticle({ ...article, content: e.target.value })}
                    placeholder="Write your article content here..."
                    rows={12}
                  />
                </TabsContent>
                <TabsContent value="en">
                  <Textarea
                    value={article.content_en}
                    onChange={(e) => setArticle({ ...article, content_en: e.target.value })}
                    placeholder="English content..."
                    rows={12}
                  />
                </TabsContent>
                <TabsContent value="fr">
                  <Textarea
                    value={article.content_fr}
                    onChange={(e) => setArticle({ ...article, content_fr: e.target.value })}
                    placeholder="French content..."
                    rows={12}
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <Textarea
                    value={article.content_ar}
                    onChange={(e) => setArticle({ ...article, content_ar: e.target.value })}
                    placeholder="Darija content..."
                    rows={12}
                    dir="rtl"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={article.image_url}
                onChange={(url) => setArticle({ ...article, image_url: url })}
                bucket="images"
                folder="articles"
                label="Article Image"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={article.status} onValueChange={(value) => setArticle({ ...article, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_review">Submit for Review</SelectItem>
                  {isAdmin && <SelectItem value="published">Published</SelectItem>}
                  {isAdmin && <SelectItem value="rejected">Rejected</SelectItem>}
                  {isAdmin && <SelectItem value="archived">Archived</SelectItem>}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                {isAdmin
                  ? "As admin, you can publish articles directly."
                  : "Submit for review when ready for admin approval."}
              </p>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Author</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={article.expert_id}
                  onValueChange={(value) => setArticle({ ...article, expert_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {experts.map((expert) => (
                      <SelectItem key={expert.id} value={expert.id}>
                        {expert.profiles?.full_name || "Unknown Expert"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Categories *</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Select at least one category for this article.
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted"
                  >
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <span className="text-sm">{category.label}</span>
                  </label>
                ))}
                {categories.length === 0 && (
                  <p className="text-sm text-muted-foreground">No categories available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {!isNew && (
            <Card>
              <CardHeader>
                <CardTitle>Article Info</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>ID:</strong> {articleId}
                </p>
                <p>
                  <strong>Author ID:</strong> {article.expert_id || "Not assigned"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
