"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"

interface Expert {
  id: string
  profile_id: string
  headline?: string
  bio?: string
  categories?: string[]
  status?: string
  avatar_url?: string
  headline_en?: string
  headline_fr?: string
  headline_ar?: string
  bio_en?: string
  bio_fr?: string
  bio_ar?: string
}

interface Profile {
  full_name?: string
  email?: string
  status?: string
}

interface Category {
  slug: string
  label?: string
  label_en?: string
  label_fr?: string
  label_ar?: string
}

interface Workshop {
  id: string
  title?: string
  title_en?: string
  title_fr?: string
  title_ar?: string
  banner_url?: string
  starts_at?: string
  status?: string
}

interface ExpertDetailClientProps {
  expert: Expert
  profile: Profile | null
  categories: Category[]
  workshops: Workshop[]
}

export function ExpertDetailClient({ expert, profile, categories, workshops }: ExpertDetailClientProps) {
  const { language: lang } = useLanguage()
  const isRTL = lang === "ar"

  // Localization helper
  function t(obj: any, baseKey: string): string {
    if (!obj) return ""
    return obj[`${baseKey}_${lang}`] || obj[`${baseKey}_en`] || obj[baseKey] || ""
  }

  // Get category label by slug
  function getCategoryLabel(slug: string): string {
    const category = categories.find((c) => c.slug === slug)
    if (!category) return slug
    return t(category, "label") || category.label || slug
  }

  // Format date
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    const locale = lang === "ar" ? "ar-MA" : lang === "fr" ? "fr-FR" : "en-US"
    return date.toLocaleDateString(locale, options)
  }

  // UI translations
  const uiText = {
    backToExperts: {
      en: "Back to Experts",
      fr: "Retour aux Experts",
      ar: "العودة للخبراء",
    },
    aboutExpert: {
      en: "About this Expert",
      fr: "À propos de cet expert",
      ar: "عن هذا الخبير",
    },
    workshopsByExpert: {
      en: "Workshops by this Expert",
      fr: "Ateliers de cet expert",
      ar: "ورشات هذا الخبير",
    },
    viewWorkshop: {
      en: "View Workshop",
      fr: "Voir l'atelier",
      ar: "عرض الورشة",
    },
    bookWorkshop: {
      en: "Book a Workshop with this Expert",
      fr: "Réserver un atelier avec cet expert",
      ar: "احجز ورشة مع هذا الخبير",
    },
    browseAllWorkshops: {
      en: "Browse All Workshops",
      fr: "Parcourir tous les ateliers",
      ar: "تصفح جميع الورشات",
    },
    noWorkshops: {
      en: "No workshops available at the moment.",
      fr: "Aucun atelier disponible pour le moment.",
      ar: "لا توجد ورشات متاحة حالياً.",
    },
  }

  const getText = (key: keyof typeof uiText) => uiText[key][lang as "en" | "fr" | "ar"] || uiText[key]["en"]

  const expertName = profile?.full_name || "Expert"
  const headline = t(expert, "headline")
  const bio = t(expert, "bio")

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6 md:px-6 lg:px-8">
        <Link href="/experts">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            {getText("backToExperts")}
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-[#C9CEC0] py-12 md:py-16 mt-4">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-lg md:h-56 md:w-56">
                <img
                  src={expert.avatar_url || "/placeholder.svg?height=224&width=224&query=professional portrait"}
                  alt={expertName}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className={`flex-1 ${isRTL ? "text-right" : "text-left"} text-center md:text-left`}>
              {/* Name - IBM Plex Sans, bold */}
              <h1 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                {expertName}
              </h1>

              {/* Headline - Plus Jakarta Sans */}
              {headline && <p className="mb-4 font-sans text-xl text-foreground/80 md:text-2xl">{headline}</p>}

              {/* Category Tags */}
              {expert.categories && expert.categories.length > 0 && (
                <div
                  className={`flex flex-wrap gap-2 ${isRTL ? "justify-end" : "justify-start"} justify-center md:justify-start`}
                >
                  {expert.categories.map((categorySlug) => (
                    <Badge
                      key={categorySlug}
                      className="rounded-full bg-[#878D73] px-4 py-1 text-sm font-medium text-white"
                    >
                      {getCategoryLabel(categorySlug)}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Two Column Layout on Desktop */}
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Bio Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h2 className="mb-6 font-display text-2xl font-bold text-foreground md:text-3xl">
              {getText("aboutExpert")}
            </h2>
            {bio ? (
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-wrap font-sans leading-relaxed text-foreground/80">{bio}</p>
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                {lang === "fr"
                  ? "Biographie non disponible."
                  : lang === "ar"
                    ? "السيرة الذاتية غير متوفرة."
                    : "Biography not available."}
              </p>
            )}
          </div>

          {/* CTA Section - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-[#E8D0C2]/50 p-6 md:p-8">
              <h3 className="mb-4 font-display text-xl font-bold text-foreground">{getText("bookWorkshop")}</h3>
              <p className="mb-6 text-sm text-foreground/70">
                {lang === "fr"
                  ? "Découvrez les ateliers animés par cet expert et inscrivez-vous."
                  : lang === "ar"
                    ? "اكتشف الورشات التي يقدمها هذا الخبير وسجل الآن."
                    : "Discover workshops led by this expert and sign up today."}
              </p>
              <Link href={`/workshops?expert=${expert.id}`}>
                <Button className="w-full rounded-full bg-[#2A7165] text-white hover:bg-[#2A7165]/90">
                  {getText("browseAllWorkshops")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Workshops by this Expert */}
      {workshops.length > 0 && (
        <section className="bg-[#F5F1E6] py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground md:text-3xl">
              {getText("workshopsByExpert")}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {workshops.map((workshop) => (
                <Card
                  key={workshop.id}
                  className="group overflow-hidden bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Workshop Thumbnail */}
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={workshop.banner_url || "/placeholder.svg?height=200&width=400&query=parenting workshop"}
                      alt={t(workshop, "title")}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-lg font-bold text-foreground text-balance">
                      {t(workshop, "title") || "Workshop"}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-2">
                    {workshop.starts_at && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(workshop.starts_at)}</span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Link href={`/workshops/${workshop.id}`} className="w-full">
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
                      >
                        {getText("viewWorkshop")}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Workshops Message */}
      {workshops.length === 0 && (
        <section className="bg-[#F5F1E6] py-12 md:py-16">
          <div className="container mx-auto px-4 text-center md:px-6 lg:px-8">
            <p className="text-muted-foreground">{getText("noWorkshops")}</p>
          </div>
        </section>
      )}
    </div>
  )
}
