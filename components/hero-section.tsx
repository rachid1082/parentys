"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/translations"
import Link from "next/link"

export function HeroSection() {
  const { language } = useLanguage()

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[600px] md:h-[700px]">
        <img
          src="https://tznhipxlrohslxbrdrnm.supabase.co/storage/v1/object/public/assets/brand/banners/Banner_with%20logo_01.jpg"
          alt="Parentys hero banner"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />

        <div className="relative container mx-auto px-4 md:px-6 lg:px-8 h-full flex flex-col justify-end pb-16 md:pb-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground font-display mb-6">
              {t("empoweringParents", language)}
            </h1>
            <p className="text-2xl md:text-3xl font-accent text-accent mb-8">{t("tagline", language)}</p>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed">
              {t("workshopsGuidance", language)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-display"
              >
                <Link href="/workshops">{t("browseWorkshops", language)}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-primary bg-transparent hover:bg-primary/10 font-display"
              >
                <Link href="/quickpath">{t("discoverQuickPath", language)}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
