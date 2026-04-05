"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/contexts/language-context"
import { ExpertCard } from "./ExpertCard"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Expert {
  id: string
  slug?: string
  image_url?: string
  name_en?: string
  name_fr?: string
  name_ar?: string
  title_en?: string
  title_fr?: string
  title_ar?: string
  bio_en?: string
  bio_fr?: string
  bio_ar?: string
  specialties_en?: string
  specialties_fr?: string
  specialties_ar?: string
  category?: string
  languages?: string[]
  available?: boolean
  social_links?: any
}

interface ExpertsListClientProps {
  experts: Expert[]
}

const ITEMS_PER_PAGE = 6

export function ExpertsListClient({ experts }: ExpertsListClientProps) {
  const { language: lang } = useLanguage()
  const isRTL = lang === "ar"

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [languageFilter, setLanguageFilter] = useState<string>("all")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  function t(obj: any, baseKey: string, language: string): string {
    return obj?.[`${baseKey}_${language}`] || obj?.[`${baseKey}_en`] || ""
  }

  // UI translations
  const uiText = {
    title: {
      en: "Our Experts",
      fr: "Nos Experts",
      ar: "خبراؤنا",
    },
    subtitle: {
      en: "Meet our team of dedicated professionals here to support your parenting journey with care and expertise.",
      fr: "Découvrez notre équipe de professionnels dévoués, là pour accompagner votre parcours parental avec bienveillance et expertise.",
      ar: "تعرف على فريقنا من المحترفين المتفانين هنا لدعم رحلتك الأبوية بعناية وخبرة.",
    },
    filterCategory: {
      en: "Category",
      fr: "Catégorie",
      ar: "الفئة",
    },
    filterLanguage: {
      en: "Language",
      fr: "Langue",
      ar: "اللغة",
    },
    filterAvailability: {
      en: "Availability",
      fr: "Disponibilité",
      ar: "التوفر",
    },
    all: {
      en: "All",
      fr: "Tous",
      ar: "الكل",
    },
    available: {
      en: "Available",
      fr: "Disponible",
      ar: "متاح",
    },
    unavailable: {
      en: "Unavailable",
      fr: "Indisponible",
      ar: "غير متاح",
    },
    loadMore: {
      en: "Load more",
      fr: "Charger plus",
      ar: "تحميل المزيد",
    },
    noExperts: {
      en: "No experts match your criteria.",
      fr: "Aucun expert ne correspond à vos critères.",
      ar: "لا يوجد خبراء يطابقون معاييرك.",
    },
    sleep: { en: "Sleep", fr: "Sommeil", ar: "النوم" },
    nutrition: { en: "Nutrition", fr: "Nutrition", ar: "التغذية" },
    behavior: { en: "Behavior", fr: "Comportement", ar: "السلوك" },
    learning: { en: "Learning", fr: "Apprentissage", ar: "التعلم" },
    emotions: { en: "Emotions", fr: "Émotions", ar: "المشاعر" },
    development: { en: "Development", fr: "Développement", ar: "التطور" },
    french: { en: "French", fr: "Français", ar: "الفرنسية" },
    english: { en: "English", fr: "Anglais", ar: "الإنجليزية" },
    arabic: { en: "Arabic", fr: "Arabe", ar: "العربية" },
    darija: { en: "Darija", fr: "Darija", ar: "الدارجة" },
  }

  const getText = (key: keyof typeof uiText) => uiText[key][lang as "en" | "fr" | "ar"] || uiText[key]["en"]

  // Get unique categories from experts
  const categories = useMemo(() => {
    const cats = new Set<string>()
    experts.forEach((expert) => {
      if (expert.category) cats.add(expert.category)
    })
    return Array.from(cats)
  }, [experts])

  // Get unique languages from experts
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>()
    experts.forEach((expert) => {
      if (expert.languages) {
        expert.languages.forEach((l) => langs.add(l))
      }
    })
    return Array.from(langs)
  }, [experts])

  // Filter experts
  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      // Category filter
      if (categoryFilter !== "all" && expert.category !== categoryFilter) {
        return false
      }
      // Language filter
      if (languageFilter !== "all" && (!expert.languages || !expert.languages.includes(languageFilter))) {
        return false
      }
      // Availability filter
      if (availabilityFilter === "available" && expert.available !== true) {
        return false
      }
      if (availabilityFilter === "unavailable" && expert.available !== false) {
        return false
      }
      return true
    })
  }, [experts, categoryFilter, languageFilter, availabilityFilter])

  // Paginated experts
  const visibleExperts = filteredExperts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredExperts.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }

  // Reset pagination when filters change
  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-[#C9CEC0] py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl text-balance">
              {getText("title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-foreground/80 text-pretty">{getText("subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Optional story image divider */}
      <div className="relative h-32 w-full overflow-hidden">
        <img
          src="https://tznhipxlrohslxbrdrnm.supabase.co/storage/v1/object/public/assets/brand/story/story-2.jpg"
          alt=""
          className="h-full w-full object-cover opacity-30"
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        {/* Filters Section */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          {/* Category Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted-foreground">{getText("filterCategory")}</label>
            <Select value={categoryFilter} onValueChange={handleFilterChange(setCategoryFilter)}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-lg bg-card">
                <SelectValue placeholder={getText("all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getText("all")}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {(uiText as any)[cat.toLowerCase()]?.[lang] || cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted-foreground">{getText("filterLanguage")}</label>
            <Select value={languageFilter} onValueChange={handleFilterChange(setLanguageFilter)}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-lg bg-card">
                <SelectValue placeholder={getText("all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getText("all")}</SelectItem>
                {availableLanguages.map((l) => (
                  <SelectItem key={l} value={l}>
                    {(uiText as any)[l.toLowerCase()]?.[lang] || l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Availability Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted-foreground">{getText("filterAvailability")}</label>
            <Select value={availabilityFilter} onValueChange={handleFilterChange(setAvailabilityFilter)}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-lg bg-card">
                <SelectValue placeholder={getText("all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{getText("all")}</SelectItem>
                <SelectItem value="available">{getText("available")}</SelectItem>
                <SelectItem value="unavailable">{getText("unavailable")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Experts Grid */}
        {visibleExperts.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">{getText("noExperts")}</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {visibleExperts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} lang={lang} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              className="rounded-full px-8 py-6 text-lg bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {getText("loadMore")}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
