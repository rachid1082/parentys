"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Baby, BookOpen, Brain, Heart, Smile, Utensils, FolderOpen } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/translations"
import { createClient } from "@/lib/supabase"

interface Category {
  id: string
  slug: string
  label: string
  label_en: string | null
  label_fr: string | null
  label_ar: string | null
  order_index: number
}

// Map category slugs to icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sleep: Baby,
  nutrition: Utensils,
  behavior: Heart,
  learning: BookOpen,
  emotions: Smile,
  other: Brain,
}

export function CategoriesSection() {
  const { language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("order_index", { ascending: true })

      if (!error && data) {
        setCategories(data)
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  const getCategoryLabel = (category: Category) => {
    if (language === "ar" && category.label_ar) return category.label_ar
    if (language === "fr" && category.label_fr) return category.label_fr
    if (language === "en" && category.label_en) return category.label_en
    return category.label
  }

  if (loading) {
    return (
      <section className="bg-muted/30 py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {t("categories", language)}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("exploreCategoriesDesc", language)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-card animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {t("categories", language)}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("exploreCategoriesDesc", language)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = iconMap[category.slug] || FolderOpen
            return (
              <Button
                key={category.id}
                variant="outline"
                className="h-auto flex-col gap-3 rounded-2xl bg-card p-6 hover:bg-accent hover:shadow-md transition-all"
              >
                <div className="rounded-full bg-primary/10 p-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-semibold">{getCategoryLabel(category)}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
