"use client"

import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/translations"

const VALUES = [
  {
    icon: "https://tznhipxlrohslxbrdrnm.supabase.co/storage/v1/object/public/assets/brand/icons/Parentys_icon_Trust.jpg",
    titleKey: "valueTrust" as const,
    descKey: "valueTrustDesc" as const,
  },
  {
    icon: "https://tznhipxlrohslxbrdrnm.supabase.co/storage/v1/object/public/assets/brand/icons/Parentys_icon_Kindness.jpg",
    titleKey: "valueKindness" as const,
    descKey: "valueKindnessDesc" as const,
  },
  {
    icon: "https://tznhipxlrohslxbrdrnm.supabase.co/storage/v1/object/public/assets/brand/icons/Parentys_icon_Accessibility.jpg",
    titleKey: "valueAccessibility" as const,
    descKey: "valueAccessibilityDesc" as const,
  },
  {
    icon: "https://tznhipxlrohslxbrdrnm.supabase.co/storage/v1/object/public/assets/brand/icons/Parentys_icon_Growth.jpg",
    titleKey: "valueGrowth" as const,
    descKey: "valueGrowthDesc" as const,
  },
  {
    icon: "https://tznhipxlrohslxbrdrnm.supabase.co/storage/v1/object/public/assets/brand/icons/Parentys_icon_Cultural%20Fit.jpg",
    titleKey: "valueCulturalFit" as const,
    descKey: "valueCulturalFitDesc" as const,
  },
]

export function ValuesSection() {
  const { language } = useLanguage()

  return (
    <section className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground font-display mb-4">
            {t("ourValues", language)}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{t("ourValuesDesc", language)}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {VALUES.map((value, index) => (
            <div
              key={index}
              className="group relative bg-background rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50"
            >
              <div className="mb-6">
                <img
                  src={value.icon || "/placeholder.svg"}
                  alt={t(value.titleKey, language)}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground font-display mb-3">{t(value.titleKey, language)}</h3>
              <p className="text-muted-foreground leading-relaxed">{t(value.descKey, language)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
