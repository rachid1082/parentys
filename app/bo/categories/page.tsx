"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { BOLayout } from "@/components/bo/bo-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Pencil, Trash2, Save, ImageIcon } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"

interface Category {
  id: string
  slug: string
  label: string
  label_en: string | null
  label_fr: string | null
  label_ar: string | null
  description: string | null
  description_en: string | null
  description_fr: string | null
  description_ar: string | null
  image_url: string | null
  order_index: number | null
}

const defaultCategory: Omit<Category, "id"> = {
  slug: "",
  label: "",
  label_en: "",
  label_fr: "",
  label_ar: "",
  description: "",
  description_en: "",
  description_fr: "",
  description_ar: "",
  image_url: "",
  order_index: 0,
}

export default function BOCategoriesPage() {
  return (
    <BOLayout>
      <CategoriesContent />
    </BOLayout>
  )
}

function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<Omit<Category, "id">>(defaultCategory)
  const [originalOrderIndex, setOriginalOrderIndex] = useState<number | null>(null)
  const supabase = createClient()

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("order_index", { ascending: true })

    if (data) {
      setCategories(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const openNewDialog = () => {
    setEditingCategory(null)
    setFormData(defaultCategory)
    setDialogOpen(true)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setOriginalOrderIndex(category.order_index)
    setFormData({
      slug: category.slug,
      label: category.label,
      label_en: category.label_en || "",
      label_fr: category.label_fr || "",
      label_ar: category.label_ar || "",
      description: category.description || "",
      description_en: category.description_en || "",
      description_fr: category.description_fr || "",
      description_ar: category.description_ar || "",
      image_url: category.image_url || "",
      order_index: category.order_index || 0,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    // Check if order is being changed when editing
    if (editingCategory && originalOrderIndex !== null && formData.order_index !== originalOrderIndex) {
      const confirmed = confirm(
        "Are you sure you want to change the order? This may override the current ordering of categories in the list."
      )
      if (!confirmed) {
        return
      }
    }

    setSaving(true)

    const payload = {
      slug: formData.slug,
      label: formData.label,
      label_en: formData.label_en || null,
      label_fr: formData.label_fr || null,
      label_ar: formData.label_ar || null,
      description: formData.description || null,
      description_en: formData.description_en || null,
      description_fr: formData.description_fr || null,
      description_ar: formData.description_ar || null,
      image_url: formData.image_url || null,
      order_index: formData.order_index,
    }

    let error
    if (editingCategory) {
      const result = await supabase.from("categories").update(payload).eq("id", editingCategory.id)
      error = result.error
    } else {
      const result = await supabase.from("categories").insert(payload)
      error = result.error
    }

    setSaving(false)

    if (error) {
      alert(`Error saving category: ${error.message}`)
      return
    }

    setDialogOpen(false)
    await fetchCategories()
  }

  const deleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category? This may affect workshops and articles linked to it.")) {
      await supabase.from("categories").delete().eq("id", id)
      fetchCategories()
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
          <h1 className="font-display text-3xl font-semibold text-[#333333]">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage workshop and article categories</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="sleep-issues"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Order in the list</Label>
                  <Input
                    type="number"
                    value={formData.order_index || 0}
                    onChange={(e) => setFormData({ ...formData, order_index: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Label (Multilingual)</Label>
                <Tabs defaultValue="default">
                  <TabsList>
                    <TabsTrigger value="default">Default</TabsTrigger>
                    <TabsTrigger value="en">EN</TabsTrigger>
                    <TabsTrigger value="fr">FR</TabsTrigger>
                    <TabsTrigger value="ar">AR</TabsTrigger>
                  </TabsList>
                  <TabsContent value="default" className="mt-2">
                    <Input
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    />
                  </TabsContent>
                  <TabsContent value="en" className="mt-2">
                    <Input
                      value={formData.label_en || ""}
                      onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
                    />
                  </TabsContent>
                  <TabsContent value="fr" className="mt-2">
                    <Input
                      value={formData.label_fr || ""}
                      onChange={(e) => setFormData({ ...formData, label_fr: e.target.value })}
                    />
                  </TabsContent>
                  <TabsContent value="ar" className="mt-2">
                    <Input
                      value={formData.label_ar || ""}
                      onChange={(e) => setFormData({ ...formData, label_ar: e.target.value })}
                      dir="rtl"
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label>Description (Multilingual)</Label>
                <Tabs defaultValue="default">
                  <TabsList>
                    <TabsTrigger value="default">Default</TabsTrigger>
                    <TabsTrigger value="en">EN</TabsTrigger>
                    <TabsTrigger value="fr">FR</TabsTrigger>
                    <TabsTrigger value="ar">AR</TabsTrigger>
                  </TabsList>
                  <TabsContent value="default" className="mt-2">
                    <Textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </TabsContent>
                  <TabsContent value="en" className="mt-2">
                    <Textarea
                      value={formData.description_en || ""}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      rows={3}
                    />
                  </TabsContent>
                  <TabsContent value="fr" className="mt-2">
                    <Textarea
                      value={formData.description_fr || ""}
                      onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                      rows={3}
                    />
                  </TabsContent>
                  <TabsContent value="ar" className="mt-2">
                    <Textarea
                      value={formData.description_ar || ""}
                      onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                      rows={3}
                      dir="rtl"
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <ImageUpload
                value={formData.image_url || ""}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                bucket="Images"
                folder="Categories"
                label="Category Image"
              />

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.order_index || 0}</TableCell>
                  <TableCell>
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.label}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                  <TableCell className="font-medium">{category.label}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {category.description || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No categories found. Create one to link to workshops and articles.
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
