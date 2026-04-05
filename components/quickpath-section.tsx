"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lightbulb, MessageCircle, Route, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/translations"
import Link from "next/link"

const steps = [
  {
    titleKey: "shareChallenge",
    descriptionKey: "shareChallengeDesc",
    icon: MessageCircle,
  },
  {
    titleKey: "getPersonalizedGuidance",
    descriptionKey: "getPersonalizedGuidanceDesc",
    icon: Lightbulb,
  },
  {
    titleKey: "followYourPath",
    descriptionKey: "followYourPathDesc",
    icon: Route,
  },
  {
    titleKey: "trackProgress",
    descriptionKey: "trackProgressDesc",
    icon: Sparkles,
  },
] as const

export function QuickPathSection() {
  const { language } = useLanguage()

  return (
    <section id="quickpath" className="bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            {t("introducingQuickPath", language)}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {t("quickPathGuidance", language)}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{t("instantAdviceDesc", language)}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={index} className="relative overflow-hidden transition-all hover:shadow-lg">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5" />
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="mb-2 text-xs font-bold text-muted-foreground">
                    {t("step", language)} {index + 1}
                  </div>
                  <CardTitle className="text-xl">{t(step.titleKey, language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-pretty leading-relaxed">
                    {t(step.descriptionKey, language)}
                  </CardDescription>
                </CardContent>
                {index < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Link href="/quickpath">
            <Button size="lg" className="rounded-full">
              {t("startQuickPathJourney", language)}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
