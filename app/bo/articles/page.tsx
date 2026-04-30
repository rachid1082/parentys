"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { BOLayout, useBOAuth } from "@/components/bo/bo-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, CheckCircle, XCircle, Loader2, FileText, ImageIcon } from "lucide-react"

interface Article {
  id: string
  title: string
  excerpt: string | null
  image_url: string | null
  status: string
  created_at: string
  expert_id: string
  experts: {
    id: string
    profiles: { full_name: string | null } | null
  } | null
}

interface Category {
  id: string
  slug: string
  label: string
}

export default function BOArticlesPage() {
  return (
    <BOLayout>
      <ArticlesContent />
    </BOLayout>
  )
}

function ArticlesContent() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [articleCategories, setArticleCategories] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { isAdmin, user } = useBOAuth()
  const supabase = createClient()

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select(`
        id,
        title,
        excerpt,
        image_url,
        status,
        created_at,
        expert_id,
        experts (
          id,
          profiles (
            full_name
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (data) {
      setArticles(data as Article[])
      
      // Fetch article categories
      const articleIds = data.map((a) => a.id)
      if (articleIds.length > 0) {
        const { data: acData } = await supabase
          .from("article_categories")
          .select("article_id, category_id")
          .in("article_id", articleIds)
        
        if (acData) {
          const mapping: Record<string, string[]> = {}
          acData.forEach((ac) => {
            if (!mapping[ac.article_id]) mapping[ac.article_id] = []
            mapping[ac.article_id].push(ac.category_id)
          })
          setArticleCategories(mapping)
        }
      }
    }

    // Fetch categories for display
    const { data: catData } = await supabase.from("categories").select("id, slug, label")
    if (catData) setCategories(catData)

    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const getCategoryLabel = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId)
    return cat?.label || categoryId
  }

  const handleStatusChange = async (articleId: string, newStatus: string) => {
    setActionLoading(articleId)
    await supabase
      .from("articles")
      .update({ 
        status: newStatus, 
        updated_at: new Date().toISOString(),
        published_at: newStatus === "published" ? new Date().toISOString() : null
      })
      .eq("id", articleId)
    await fetchArticles()
    setActionLoading(null)
  }

  const handleDelete = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return
    setActionLoading(articleId)
    await supabase.from("articles").delete().eq("id", articleId)
    await fetchArticles()
    setActionLoading(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>
      case "pending_review":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending Review</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Archived</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Draft</Badge>
    }
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
        <div>
          <h1 className="text-3xl font-display font-bold text-[#333333]">Articles</h1>
          <p className="text-muted-foreground mt-1">Manage articles and blog posts</p>
        </div>
        <Link href="/bo/articles/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.filter((a) => a.status === "published").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Eye className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.filter((a) => a.status === "pending_review").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.filter((a) => a.status === "draft").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="h-10 w-14 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-14 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{article.title || "Untitled"}</div>
                    {article.excerpt && (
                      <div className="text-sm text-muted-foreground line-clamp-1">{article.excerpt}</div>
                    )}
                  </TableCell>
                  <TableCell>{article.experts?.profiles?.full_name || "Unknown"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(articleCategories[article.id] || []).slice(0, 2).map((catId) => (
                        <Badge key={catId} variant="outline" className="text-xs">
                          {getCategoryLabel(catId)}
                        </Badge>
                      ))}
                      {(articleCategories[article.id] || []).length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{(articleCategories[article.id] || []).length - 2}
                        </Badge>
                      )}
                      {(articleCategories[article.id] || []).length === 0 && (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(article.status)}</TableCell>
                  <TableCell>{new Date(article.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={actionLoading === article.id}>
                          {actionLoading === article.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/bo/articles/${article.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {isAdmin && article.status === "pending_review" && (
                          <>
                            <DropdownMenuItem onClick={() => handleStatusChange(article.id, "published")}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Approve & Publish
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(article.id, "rejected")}>
                              <XCircle className="mr-2 h-4 w-4 text-red-600" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {isAdmin && article.status === "published" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(article.id, "archived")}>
                            <XCircle className="mr-2 h-4 w-4 text-gray-600" />
                            Archive
                          </DropdownMenuItem>
                        )}
                        {isAdmin && (
                          <DropdownMenuItem onClick={() => handleDelete(article.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {articles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No articles yet. Create your first article to get started.
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
