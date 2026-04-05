"use client"

import { Button } from "@/components/ui/button"
import { Baby, BookOpen, Brain, Heart, Smile, Utensils } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/translations"

const categories = [
  { name: "sleep", icon: Baby },
  { name: "nutrition", icon: Utensils },
  { name: "behavior", icon: Heart },
  { name: "learning", icon: BookOpen },
  { name: "emotions", icon: Smile },
  { name: "other", icon: Brain },
] as const

export function CategoriesSection() {
  const { language } = useLanguage()

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
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto flex-col gap-3 rounded-2xl bg-card p-6 hover:bg-accent hover:shadow-md transition-all"
              >
                <div className="rounded-full bg-primary/10 p-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-semibold">{t(category.name, language)}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
