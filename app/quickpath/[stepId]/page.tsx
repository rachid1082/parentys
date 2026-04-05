import { createServerSupabaseClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import { StepView } from "@/components/quickpath/step-view"

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

export default async function QuickPathStepPage({ params }: { params: Promise<{ stepId: string }> }) {
  const { stepId } = await params
  const supabase = await createServerSupabaseClient()

  // Fetch the step
  const { data: step, error: stepError } = await supabase
    .from("quickpath_steps")
    .select("*")
    .eq("id", stepId)
    .single<QuickPathStep>()

  if (stepError || !step) {
    notFound()
  }

  // Fetch answers for this step without ordering
  const { data: answers, error: answersError } = await supabase
    .from("quickpath_answers")
    .select("*")
    .eq("step_id", stepId)

  if (answersError) {
    console.error("Error fetching answers:", answersError)
  }

  return <StepView step={step} answers={(answers as QuickPathAnswer[]) || []} stepId={stepId} />
}
