"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Sparkles, BookOpen } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

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

type RecommendationRule = {
  id: string
  age_answer_id: string
  issue_answer_id: string
  recommendation_en: string
  recommendation_fr: string
  recommendation_ar: string
  action_plan_en: string | null
  action_plan_fr: string | null
  action_plan_ar: string | null
  example_en: string | null
  example_fr: string | null
  example_ar: string | null
  workshop_ids: string[] | null
  created_at: string
}

type RecommendationViewProps = {
  answer: QuickPathAnswer
  rule: RecommendationRule | null
}

function t(obj: any, baseKey: string, lang: string): string {
  return obj?.[`${baseKey}_${lang}`] || obj?.[`${baseKey}_en`] || ""
}

export function RecommendationView({ answer, rule }: RecommendationViewProps) {
  const [lang, setLang] = useState("en")
  const [isRTL, setIsRTL] = useState(false)

  useEffect(() => {
    const currentLang = localStorage.getItem("qp_lang") || "en"
    setLang(currentLang)
    setIsRTL(currentLang === "ar")
  }, [])

  const recommendation = rule ? t(rule, "recommendation", lang) : t(answer, "recommendation", lang)

  const actionPlan = rule ? t(rule, "action_plan", lang) : t(answer, "action_plan", lang)

  const example = rule ? t(rule, "example", lang) : t(answer, "example", lang)

  const workshopIds = rule?.workshop_ids || answer.recommended_workshop_ids || []

  // Parse recommendation into bullet points
  const recommendations =
    recommendation
      ?.split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^[•\-*]\s*/, "").trim()) || []

  // Parse action plan into bullet points
  const actionPoints =
    actionPlan
      ?.split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^[•\-*]\s*/, "").trim()) || []

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-primary/5 pb-8">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl text-center text-balance">
              {lang === "fr"
                ? "Votre recommandation personnalisée"
                : lang === "ar"
                  ? "توصيتك الشخصية"
                  : "Your Personalized Recommendation"}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            {recommendations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  {lang === "fr" ? "Recommandations :" : lang === "ar" ? "التوصيات:" : "Recommendations:"}
                </h3>
                <ul className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {actionPoints.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {lang === "fr" ? "Plan d'action :" : lang === "ar" ? "خطة العمل:" : "Action Plan:"}
                </h3>
                <ul className="space-y-3">
                  {actionPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-secondary" />
                      <span className="text-muted-foreground leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {example && (
              <div className="mb-8 p-4 bg-muted/50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  {lang === "fr" ? "Exemple :" : lang === "ar" ? "مثال:" : "Example:"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{example}</p>
              </div>
            )}

            {workshopIds.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  {lang === "fr"
                    ? "Ateliers recommandés :"
                    : lang === "ar"
                      ? "ورش العمل الموصى بها:"
                      : "Recommended Workshops:"}
                </h3>
                <div className="space-y-3">
                  {workshopIds.map((workshopId) => (
                    <Card key={workshopId} className="bg-muted/50">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">
                          {lang === "fr" ? "ID de l'atelier :" : lang === "ar" ? "معرف الورشة:" : "Workshop ID:"}{" "}
                          {workshopId}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {lang === "fr"
                            ? "(Les détails de l'atelier seront récupérés de la base de données)"
                            : lang === "ar"
                              ? "(سيتم جلب تفاصيل الورشة من قاعدة البيانات)"
                              : "(Workshop details will be fetched from database)"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/#quickpath" className="flex-1">
                <Button variant="outline" size="lg" className="w-full rounded-full bg-transparent">
                  {lang === "fr" ? "Recommencer" : lang === "ar" ? "ابدأ من جديد" : "Start Another Path"}
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button size="lg" className="w-full rounded-full gap-2">
                  <Home className="h-4 w-4" />
                  {lang === "fr" ? "Retour à l'accueil" : lang === "ar" ? "العودة للصفحة الرئيسية" : "Back to Home"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
