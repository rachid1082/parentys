"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type QuickPathAnswer = {
  id: string
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
}

type RecommendationRule = {
  id: string
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
}

type Workshop = {
  id: string
  title_en: string | null
  title_fr: string | null
  title_ar: string | null
}

export default function QuickPathResultClient({ finalAnswer }: { finalAnswer: QuickPathAnswer }) {
  const [rule, setRule] = useState<RecommendationRule | null>(null)
  const [lang, setLang] = useState<string>("en")
  const [loading, setLoading] = useState(true)
  const [workshops, setWorkshops] = useState<Workshop[]>([])

  function t(obj: any, baseKey: string, lang: string): string {
    return obj?.[`${baseKey}_${lang}`] || obj?.[`${baseKey}_fr`] || obj?.[`${baseKey}_en`] || ""
  }

  useEffect(() => {
    async function loadRule() {
      const storedLang = localStorage.getItem("qp_lang") || "en"
      const issueAnswerId = localStorage.getItem("qp_issue_answer")
      const ageAnswerId = localStorage.getItem("qp_age_answer")

      setLang(storedLang)

      const supabase = createClient()

      if (issueAnswerId && ageAnswerId) {
        const { data: ruleData } = await supabase
          .from("quickpath_recommendation_rules")
          .select("*")
          .eq("issue_answer_id", issueAnswerId)
          .eq("age_answer_id", ageAnswerId)
          .limit(1)
          .maybeSingle()

        if (ruleData) {
          setRule(ruleData)
        }
      }

      const workshopIds = rule?.workshop_ids || finalAnswer.recommended_workshop_ids

      if (workshopIds && workshopIds.length > 0) {
        const { data: workshopData } = await supabase
          .from("workshops")
          .select("id, title_en, title_fr, title_ar")
          .in("id", workshopIds)

        if (workshopData) {
          setWorkshops(workshopData)
        }
      }

      setLoading(false)
    }

    loadRule()
  }, [finalAnswer.recommended_workshop_ids])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5">
        <div className="text-muted-foreground">
          {lang === "fr" ? "Chargement..." : lang === "ar" ? "جاري التحميل..." : "Loading..."}
        </div>
      </div>
    )
  }

  const recommendation = rule ? t(rule, "recommendation", lang) : t(finalAnswer, "recommendation", lang)
  const actionPlan = rule ? t(rule, "action_plan", lang) : t(finalAnswer, "action_plan", lang)
  const example = rule ? t(rule, "example", lang) : t(finalAnswer, "example", lang)

  const isRTL = lang === "ar"
  const dir = isRTL ? "rtl" : "ltr"

  const uiText = {
    title: {
      en: "Your Personalized Recommendation",
      fr: "Votre recommandation personnalisée",
      ar: "توصيتك الشخصية",
    },
    whatsHappening: {
      en: "What's happening",
      fr: "Ce qui se passe",
      ar: "ما يحدث",
    },
    whatYouCanDo: {
      en: "What you can do",
      fr: "Ce que vous pouvez faire",
      ar: "ما يمكنك فعله",
    },
    example: {
      en: "Example",
      fr: "Exemple",
      ar: "مثال",
    },
    suggestedWorkshops: {
      en: "Suggested Workshops",
      fr: "Ateliers suggérés",
      ar: "ورش العمل المقترحة",
    },
    backToHome: {
      en: "Back to Home",
      fr: "Retour à l'accueil",
      ar: "العودة للرئيسية",
    },
    startOver: {
      en: "Start Over",
      fr: "Recommencer",
      ar: "ابدأ من جديد",
    },
  }

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {uiText.backToHome[lang as keyof typeof uiText.backToHome]}
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center text-balance mb-8">
          {uiText.title[lang as keyof typeof uiText.title]}
        </h1>

        {recommendation && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className={isRTL ? "text-right" : ""}>
                {uiText.whatsHappening[lang as keyof typeof uiText.whatsHappening]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-muted-foreground leading-relaxed ${isRTL ? "text-right" : ""}`}>{recommendation}</p>
            </CardContent>
          </Card>
        )}

        {actionPlan && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className={isRTL ? "text-right" : ""}>
                {uiText.whatYouCanDo[lang as keyof typeof uiText.whatYouCanDo]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
                {actionPlan
                  .split("\n")
                  .filter(Boolean)
                  .map((line, idx) => (
                    <li key={idx} className="text-muted-foreground leading-relaxed">
                      • {line}
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {example && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className={isRTL ? "text-right" : ""}>
                {uiText.example[lang as keyof typeof uiText.example]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-muted-foreground italic leading-relaxed ${isRTL ? "text-right" : ""}`}>{example}</p>
            </CardContent>
          </Card>
        )}

        {workshops.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className={isRTL ? "text-right" : ""}>
                {uiText.suggestedWorkshops[lang as keyof typeof uiText.suggestedWorkshops]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {workshops.map((workshop) => (
                  <div
                    key={workshop.id}
                    className={`px-4 py-3 bg-primary/10 text-primary font-medium rounded-xl ${isRTL ? "text-right" : ""}`}
                  >
                    {t(workshop, "title", lang)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 justify-center mt-8">
          <Link href="/quickpath">
            <Button size="lg" className="rounded-full">
              {uiText.startOver[lang as keyof typeof uiText.startOver]}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
