"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

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

type AnswerButtonProps = {
  answer: QuickPathAnswer
  lang: string
  stepId: string
}

const ISSUE_STEP_ID = "00000000-0000-0000-0000-000000000001"
const AGE_STEP_ID = "00000000-0000-0000-0000-000000000002"

function t(obj: any, baseKey: string, lang: string): string {
  return obj?.[`${baseKey}_${lang}`] || obj?.[`${baseKey}_en`] || ""
}

export function AnswerButton({ answer, lang, stepId }: AnswerButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (stepId === ISSUE_STEP_ID) {
      localStorage.setItem("qp_issue_answer", answer.id)
    }

    if (stepId === AGE_STEP_ID) {
      localStorage.setItem("qp_age_answer", answer.id)
    }

    localStorage.setItem("qp_last_answer", answer.id)

    if (answer.next_step_id) {
      router.push(`/quickpath/${answer.next_step_id}`)
    } else {
      router.push(`/quickpath/result/${answer.id}`)
    }
  }

  const label = t(answer, "label", lang)

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="lg"
      className="w-full justify-between h-auto py-4 px-6 text-left hover:bg-primary/10 hover:border-primary transition-all rounded-2xl bg-transparent"
    >
      <span className="text-base font-medium">{label}</span>
      <ArrowRight className="h-5 w-5 ml-4 flex-shrink-0" />
    </Button>
  )
}
