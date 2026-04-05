"use client"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Workshop {
  id: string
  title_en?: string
  title_fr?: string
  title_ar?: string
  short_description_en?: string
  short_description_fr?: string
  short_description_ar?: string
  video_url?: string
}

interface WorkshopStartClientProps {
  workshop: Workshop
}

export function WorkshopStartClient({ workshop }: WorkshopStartClientProps) {
  const { language: lang } = useLanguage()

  const isRTL = lang === "ar"

  function t(obj: any, baseKey: string, language: string): string {
    return obj?.[`${baseKey}_${language}`] || obj?.[`${baseKey}_en`] || ""
  }

  const backLabel = {
    en: "Back to workshop details",
    fr: "Retour aux détails de l'atelier",
    ar: "Rja3 l'dtayl dyal l'workshop",
  }

  const homeLabel = {
    en: "Back to home",
    fr: "Retour à l'accueil",
    ar: "Rja3 l'blassa",
  }

  const noVideoMessage = {
    en: "This workshop video will be available soon.",
    fr: "La vidéo de cet atelier sera bientôt disponible.",
    ar: "L‑video dyal had l‑workshop ghadi tkoun mwdjoda qriban.",
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {homeLabel[lang]}
        </Link>

        <Link
          href={`/workshops/${workshop.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel[lang]}
        </Link>

        <div className="max-w-5xl mx-auto">
          <h1 className="mb-4 text-3xl font-bold text-primary md:text-4xl text-balance">
            {t(workshop, "title", lang)}
          </h1>

          {t(workshop, "short_description", lang) && (
            <p className="mb-6 text-lg text-muted-foreground text-pretty">{t(workshop, "short_description", lang)}</p>
          )}

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {workshop.video_url ? (
                <video controls className="w-full rounded-lg" controlsList="nodownload">
                  <source src={workshop.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex items-center justify-center aspect-video bg-muted rounded-lg">
                  <p className="text-center text-muted-foreground px-4">{noVideoMessage[lang]}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
