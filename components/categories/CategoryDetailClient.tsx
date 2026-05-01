"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/translations"
import { Baby, BookOpen, Brain, Heart, Smile, Utensils, FolderOpen, Calendar, Clock, ArrowRight, FileText, ChevronLeft } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
}

interface Workshop {
  id: string
  title_en: string | null
  title_fr: string | null
  title_ar: string | null
  description_en: string | null
  description_fr: string | null
  description_ar: string | null
  image_url: string | null
  starts_at: string | null
  duration_minutes: number | null
  price_dzd: number | null
  experts?: {
    id: string
    profile_id: string
    profiles?: {
      full_name: string | null
      avatar_url: string | null
    }
  }
}

interface Article {
  id: string
  title_en: string | null
  title_fr: string | null
  title_ar: string | null
  excerpt_en: string | null
  excerpt_fr: string | null
  excerpt_ar: string | null
  image_url: string | null
  created_at: string
}

interface Props {
  category: Category
  workshops: Workshop[]
  articles: Article[]
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

export function CategoryDetailClient({ category, workshops, articles }: Props) {
  const { language } = useLanguage()

  const getCategoryLabel = () => {
    if (language === "ar" && category.label_ar) return category.label_ar
    if (language === "fr" && category.label_fr) return category.label_fr
    if (language === "en" && category.label_en) return category.label_en
    return category.label
  }

  const getCategoryDescription = () => {
    if (language === "ar" && category.description_ar) return category.description_ar
    if (language === "fr" && category.description_fr) return category.description_fr
    if (language === "en" && category.description_en) return category.description_en
    return category.description
  }

  const getWorkshopTitle = (workshop: Workshop) => {
    if (language === "ar" && workshop.title_ar) return workshop.title_ar
    if (language === "fr" && workshop.title_fr) return workshop.title_fr
    return workshop.title_en || "Untitled Workshop"
  }

  const getWorkshopDescription = (workshop: Workshop) => {
    if (language === "ar" && workshop.description_ar) return workshop.description_ar
    if (language === "fr" && workshop.description_fr) return workshop.description_fr
    return workshop.description_en || ""
  }

  const getArticleTitle = (article: Article) => {
    if (language === "ar" && article.title_ar) return article.title_ar
    if (language === "fr" && article.title_fr) return article.title_fr
    return article.title_en || "Untitled Article"
  }

  const getArticleExcerpt = (article: Article) => {
    if (language === "ar" && article.excerpt_ar) return article.excerpt_ar
    if (language === "fr" && article.excerpt_fr) return article.excerpt_fr
    return article.excerpt_en || ""
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString(language === "ar" ? "ar-DZ" : language === "fr" ? "fr-FR" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleTimeString(language === "ar" ? "ar-DZ" : language === "fr" ? "fr-FR" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const Icon = iconMap[category.slug] || FolderOpen

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <Link 
            href="/#categories" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("backToCategories", language) || "Back to Categories"}
          </Link>

          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="rounded-full bg-primary/10 p-6 mb-6">
              <Icon className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl mb-4">
              {getCategoryLabel()}
            </h1>
            {getCategoryDescription() && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {getCategoryDescription()}
              </p>
            )}

            <div className="flex items-center gap-4 mt-8">
              <Badge variant="secondary" className="px-4 py-2">
                {workshops.length} {workshops.length === 1 ? t("workshop", language) || "Workshop" : t("workshops", language) || "Workshops"}
              </Badge>
              {articles.length > 0 && (
                <Badge variant="secondary" className="px-4 py-2">
                  {articles.length} {articles.length === 1 ? t("article", language) || "Article" : t("articles", language) || "Articles"}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <Tabs defaultValue="workshops" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="workshops" className="gap-2">
                <Calendar className="h-4 w-4" />
                {t("workshops", language) || "Workshops"}
              </TabsTrigger>
              <TabsTrigger value="articles" className="gap-2">
                <FileText className="h-4 w-4" />
                {t("articles", language) || "Articles"}
              </TabsTrigger>
            </TabsList>

            {/* Workshops Tab */}
            <TabsContent value="workshops">
              {workshops.length === 0 ? (
                <div className="text-center py-16">
                  <div className="rounded-full bg-muted/50 p-6 w-fit mx-auto mb-6">
                    <Calendar className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t("noWorkshopsYet", language) || "No workshops yet"}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("noWorkshopsInCategory", language) || "There are no workshops in this category yet. Check back soon!"}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {workshops.map((workshop) => (
                    <Card key={workshop.id} className="group overflow-hidden hover:shadow-lg transition-all">
                      <div className="relative aspect-video overflow-hidden">
                        {workshop.image_url ? (
                          <Image
                            src={workshop.image_url}
                            alt={getWorkshopTitle(workshop)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <Icon className="h-16 w-16 text-primary/40" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {getWorkshopTitle(workshop)}
                        </h3>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {getWorkshopDescription(workshop)}
                        </p>
                        <div className="flex flex-col gap-2 text-sm">
                          {workshop.starts_at && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>{formatDate(workshop.starts_at)}</span>
                            </div>
                          )}
                          {workshop.starts_at && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4 text-primary" />
                              <span>{formatTime(workshop.starts_at)}</span>
                              {workshop.duration_minutes && (
                                <span className="text-muted-foreground/70">
                                  ({workshop.duration_minutes} min)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-4 flex items-center justify-between">
                        {workshop.price_dzd !== null && (
                          <span className="font-semibold text-primary">
                            {workshop.price_dzd.toLocaleString()} DZD
                          </span>
                        )}
                        <Button asChild size="sm" variant="ghost" className="ml-auto gap-2 group-hover:text-primary">
                          <Link href={`/workshops/${workshop.id}`}>
                            {t("viewDetails", language) || "View Details"}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Articles Tab */}
            <TabsContent value="articles">
              {articles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="rounded-full bg-muted/50 p-6 w-fit mx-auto mb-6">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t("noArticlesYet", language) || "No articles yet"}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("noArticlesInCategory", language) || "There are no articles in this category yet. Check back soon!"}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <Card key={article.id} className="group overflow-hidden hover:shadow-lg transition-all">
                      <div className="relative aspect-video overflow-hidden">
                        {article.image_url ? (
                          <Image
                            src={article.image_url}
                            alt={getArticleTitle(article)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                            <FileText className="h-16 w-16 text-accent/40" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {getArticleTitle(article)}
                        </h3>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {getArticleExcerpt(article)}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-3">
                          {formatDate(article.created_at)}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-4">
                        <Button asChild size="sm" variant="ghost" className="ml-auto gap-2 group-hover:text-primary">
                          <Link href={`/articles/${article.id}`}>
                            {t("readMore", language) || "Read More"}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}
