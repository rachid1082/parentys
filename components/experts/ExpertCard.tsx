"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

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
  languages?: string[]
  available?: boolean
}

interface ExpertCardProps {
  expert: Expert
  lang: "en" | "fr" | "ar"
}

export function ExpertCard({ expert, lang }: ExpertCardProps) {
  function t(obj: any, baseKey: string, language: string): string {
    return obj?.[`${baseKey}_${language}`] || obj?.[`${baseKey}_en`] || ""
  }

  const expertUrl = expert.slug ? `/experts/${expert.slug}` : `/experts/${expert.id}`

  const viewProfileLabel = {
    en: "View Profile",
    fr: "Voir le profil",
    ar: "عرض الملف",
  }

  const languageLabels: Record<string, Record<string, string>> = {
    french: { en: "French", fr: "Français", ar: "الفرنسية" },
    english: { en: "English", fr: "Anglais", ar: "الإنجليزية" },
    arabic: { en: "Arabic", fr: "Arabe", ar: "العربية" },
    darija: { en: "Darija", fr: "Darija", ar: "الدارجة" },
  }

  // Truncate bio for card display (2-3 lines max)
  const bio = t(expert, "bio", lang)
  const shortBio = bio.length > 120 ? bio.substring(0, 120) + "..." : bio

  return (
    <Card className="group overflow-hidden bg-[#E8D0C2]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      {/* Expert Photo */}
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={expert.image_url || "/placeholder.svg?height=400&width=400&query=professional portrait"}
          alt={t(expert, "name", lang)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardHeader className="pb-2">
        {/* Name - IBM Plex Sans, bold */}
        <CardTitle className="font-display text-xl font-bold text-foreground text-balance">
          {t(expert, "name", lang) || "Expert Name"}
        </CardTitle>
        {/* Specialty - Plus Jakarta Sans */}
        <CardDescription className="font-sans text-primary font-medium">
          {t(expert, "title", lang) || "Professional Title"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {/* Languages */}
        {expert.languages && expert.languages.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {expert.languages.map((language) => (
              <Badge key={language} variant="secondary" className="rounded-full bg-[#C9CEC0] text-foreground text-xs">
                {languageLabels[language.toLowerCase()]?.[lang] || language}
              </Badge>
            ))}
          </div>
        )}

        {/* Bio excerpt */}
        <p className="text-sm text-muted-foreground text-pretty leading-relaxed">{shortBio || "Bio not available"}</p>
      </CardContent>

      <CardFooter>
        <Link href={expertUrl} className="w-full">
          <Button
            variant="outline"
            className="w-full rounded-full bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {viewProfileLabel[lang]}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
