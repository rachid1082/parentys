import { createServerSupabaseClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"

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

import QuickPathResultClient from "./result-client"

export default async function QuickPathResultPage({ params }: { params: Promise<{ answerId: string }> }) {
  const { answerId } = await params
  const supabase = await createServerSupabaseClient()

  const { data: finalAnswer } = await supabase.from("quickpath_answers").select("*").eq("id", answerId).single()

  if (!finalAnswer) {
    notFound()
  }

  return <QuickPathResultClient finalAnswer={finalAnswer as QuickPathAnswer} />
}
