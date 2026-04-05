"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Workshop {
  id: string
  slug?: string
  banner_url?: string
  title_en?: string
  title_fr?: string
  title_ar?: string
  description_en?: string
  description_fr?: string
  description_ar?: string
  short_description_en?: string
  short_description_fr?: string
  short_description_ar?: string
  age_range?: string
  duration?: string
  difficulty?: string
  availability_status?: string
  price_cents?: number
  currency?: string
}

interface WorkshopDetailClientProps {
  workshop: Workshop
}

export function WorkshopDetailClient({ workshop }: WorkshopDetailClientProps) {
  const { language: lang } = useLanguage()
  const router = useRouter()

  const isRTL = lang === "ar"

  function t(obj: any, baseKey: string, language: string): string {
    return obj?.[`${baseKey}_${language}`] || obj?.[`${baseKey}_en`] || ""
  }

  const handleCTA = () => {
    if (workshop.availability_status === "evergreen") {
      router.push(`/workshops/${workshop.id}/start`)
    } else {
      // For cohort workshops, do nothing (waitlist button)
      console.log("[v0] Waitlist button clicked - no action configured yet")
    }
  }

  const getCTAButton = () => {
    switch (workshop.availability_status) {
      case "evergreen":
        return {
          label: lang === "en" ? "Start now" : lang === "fr" ? "Commencer maintenant" : "Bda daba",
          variant: "default" as const,
        }
      case "online_cohort":
      case "onsite_cohort":
        return {
          label:
            lang === "en"
              ? "Join the waitlist"
              : lang === "fr"
                ? "Rejoindre la liste d'attente"
                : "Zid smiytek f‑l‑lîst",
          variant: "secondary" as const,
        }
      default:
        return {
          label: lang === "en" ? "Get started" : lang === "fr" ? "Commencer" : "Bda",
          variant: "default" as const,
        }
    }
  }

  const ctaButton = getCTAButton()

  const backLabel = {
    en: "Back to workshops",
    fr: "Retour aux ateliers",
    ar: "Rja3 l'workshops",
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <Link
          href="/workshops"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel[lang]}
        </Link>

        {workshop.banner_url && (
          <div className="mb-8 overflow-hidden rounded-2xl aspect-video w-full max-w-4xl mx-auto">
            <img
              src={workshop.banner_url || "https://source.unsplash.com/featured/?parenting,workshop"}
              alt={t(workshop, "title", lang)}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              <h1 className="mb-6 text-4xl font-bold text-primary md:text-5xl text-balance">
                {t(workshop, "title", lang)}
              </h1>

              <div className="flex flex-wrap gap-3 mb-8">
                {workshop.age_range && (
                  <Badge variant="outline" className="bg-accent/10 text-accent-foreground px-4 py-2 text-sm">
                    {lang === "en" ? "Age: " : lang === "fr" ? "Âge : " : "L3mar: "}
                    {workshop.age_range}
                  </Badge>
                )}
                {workshop.duration && (
                  <Badge variant="outline" className="bg-accent/10 text-accent-foreground px-4 py-2 text-sm">
                    {lang === "en" ? "Duration: " : lang === "fr" ? "Durée : " : "Lwa9t: "}
                    {workshop.duration}
                  </Badge>
                )}
                {workshop.difficulty && (
                  <Badge variant="outline" className="bg-accent/10 text-accent-foreground px-4 py-2 text-sm">
                    {lang === "en" ? "Level: " : lang === "fr" ? "Niveau : " : "Lmostawa: "}
                    {workshop.difficulty}
                  </Badge>
                )}
              </div>

              {t(workshop, "short_description", lang) && (
                <p className="mb-6 text-lg text-muted-foreground text-pretty">
                  {t(workshop, "short_description", lang)}
                </p>
              )}

              <div className="mb-8 prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {t(workshop, "description", lang)}
                </p>
              </div>

              <div className="flex justify-center mt-8">
                <Button variant={ctaButton.variant} size="lg" className="rounded-full px-8 text-lg" onClick={handleCTA}>
                  {ctaButton.label}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
