"use client"
import { WorkshopCard } from "./WorkshopCard"
import { useLanguage } from "@/contexts/language-context"

interface Workshop {
  id: string
  slug?: string
  banner_url?: string
  title_en?: string
  title_fr?: string
  title_ar?: string
  short_description_en?: string
  short_description_fr?: string
  short_description_ar?: string
  age_range?: string
  duration?: string
  difficulty?: string
  availability_status?: string
}

interface WorkshopsListClientProps {
  workshops: Workshop[]
}

export function WorkshopsListClient({ workshops }: WorkshopsListClientProps) {
  const { language: lang } = useLanguage()

  const isRTL = lang === "ar"

  function t(obj: any, baseKey: string, language: string): string {
    return obj?.[`${baseKey}_${language}`] || obj?.[`${baseKey}_en`] || ""
  }

  const pageTitle = {
    title_en: "Explore our workshops",
    title_fr: "Découvrez nos ateliers",
    title_ar: "Tchouf l‑workshops dyalna",
  }

  const pageIntro = {
    intro_en:
      "Choose from our selection of practical, expert-led workshops designed to support your parenting journey.",
    intro_fr:
      "Choisissez parmi nos ateliers pratiques, animés par des experts, pour vous accompagner dans votre parcours parental.",
    intro_ar: "Ikhtar men workshops mdfa3in w m3a experts bash tsahhel 3lik ttarbiya.",
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary md:text-5xl text-balance">
            {t(pageTitle, "title", lang)}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">{t(pageIntro, "intro", lang)}</p>
        </div>

        {workshops.length === 0 ? (
          <div className="text-center text-muted-foreground">
            {lang === "en" && "No workshops available at the moment."}
            {lang === "fr" && "Aucun atelier disponible pour le moment."}
            {lang === "ar" && "Ma kaynch workshops daba."}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {workshops.map((workshop) => (
              <WorkshopCard
                key={workshop.id}
                id={workshop.id}
                slug={workshop.slug}
                imageUrl={workshop.banner_url || "https://source.unsplash.com/featured/?parenting"}
                title={t(workshop, "title", lang)}
                shortDescription={t(workshop, "short_description", lang)}
                ageRange={workshop.age_range}
                duration={workshop.duration}
                difficulty={workshop.difficulty}
                availabilityStatus={workshop.availability_status}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
