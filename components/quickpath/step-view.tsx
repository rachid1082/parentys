"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnswerButton } from "./answer-button"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

type QuickPathStep = {
  id: string
  title_en: string
  title_fr: string
  title_ar: string
  description_en: string | null
  description_fr: string | null
  description_ar: string | null
  created_at: string
  updated_at: string
}

type QuickPathAnswer = {
  id: string
  step_id: string
  label_en: string
  label_fr: string
  label_ar: string
  next_step_id: string | null
  recommendation_en: string | null
  recommendation_fr: string | null
  recommendation_ar: string | null
  action_plan_en: string | null
  action_plan_fr: string | null
  action_plan_ar: string | null
  example_en: string | null
  example_fr: string | null
  example_ar: string | null
  recommended_workshop_ids: string[] | null
  created_at: string
}

type StepViewProps = {
  step: QuickPathStep
  answers: QuickPathAnswer[]
  stepId: string
}

function t(obj: any, baseKey: string, lang: string): string {
  return obj?.[`${baseKey}_${lang}`] || obj?.[`${baseKey}_en`] || ""
}

export function StepView({ step, answers, stepId }: StepViewProps) {
  const [lang, setLang] = useState("en")
  const [isRTL, setIsRTL] = useState(false)

  useEffect(() => {
    const currentLang = localStorage.getItem("qp_lang") || "en"
    setLang(currentLang)
    setIsRTL(currentLang === "ar")
  }, [])

  const title = t(step, "title", lang)
  const description = t(step, "description", lang)

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="mb-6">
          <Link href="/#quickpath">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {lang === "fr" ? "Retour" : lang === "ar" ? "رجوع" : "Back to Home"}
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-primary/5 pb-8">
            <div className="mb-2 text-sm font-semibold text-primary">
              {lang === "fr" ? "QuickPath Guidance" : lang === "ar" ? "إرشادات QuickPath" : "QuickPath Guidance"}
            </div>
            <CardTitle className="text-2xl md:text-3xl text-balance">{title}</CardTitle>
            {description && (
              <CardDescription className="text-base mt-3 text-pretty leading-relaxed">{description}</CardDescription>
            )}
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">
                {lang === "fr" ? "Choisissez votre réponse :" : lang === "ar" ? "اختر إجابتك:" : "Choose your answer:"}
              </h3>
              {answers.map((answer) => (
                <AnswerButton key={answer.id} answer={answer} lang={lang} stepId={stepId} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
