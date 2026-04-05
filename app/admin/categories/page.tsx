"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Pencil, Trash2, Save } from "lucide-react"

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
  order_index: 0,
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<Omit<Category, "id">>(defaultCategory)
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
      order_index: category.order_index || 0,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
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
      order_index: formData.order_index,
    }

    if (editingCategory) {
      await supabase.from("categories").update(payload).eq("id", editingCategory.id)
    } else {
      await supabase.from("categories").insert(payload)
    }

    setSaving(false)
    setDialogOpen(false)
    fetchCategories()
  }

  const deleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await supabase.from("categories").delete().eq("id", id)
      fetchCategories()
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
            <h1 className="font-display text-3xl font-semibold text-[#333333]">Categories</h1>
            <p className="text-muted-foreground mt-1">Manage workshop and expert categories</p>
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
                    <Label>Order Index</Label>
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
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No categories found
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
