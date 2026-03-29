import { Navbar } from "@/components/navbar"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { ExpertDetailClient } from "@/components/experts/ExpertDetailClient"
import { notFound } from "next/navigation"

interface ExpertDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ExpertDetailPage({ params }: ExpertDetailPageProps) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  // Fetch expert with profile data
  const { data: expert, error: expertError } = await supabase
    .from("experts")
    .select(`
      id,
      profile_id,
      headline,
      bio,
      categories,
      status,
      avatar_url,
      headline_en,
      headline_fr,
      headline_ar,
      bio_en,
      bio_fr,
      bio_ar,
      created_at,
      updated_at
    `)
    .eq("id", id)
    .single()

  if (expertError || !expert) {
    notFound()
  }

  // Fetch profile data for full_name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, status")
    .eq("id", expert.profile_id)
    .single()

  // Fetch categories for labels
  const { data: categoriesData } = await supabase.from("categories").select("slug, label, label_en, label_fr, label_ar")

  // Fetch published workshops by this expert's profile
  const { data: workshops } = await supabase
    .from("workshops")
    .select(`
      id,
      title,
      title_en,
      title_fr,
      title_ar,
      banner_url,
      starts_at,
      status
    `)
    .eq("profile_id", expert.profile_id)
    .eq("status", "published")
    .order("starts_at", { ascending: true })

  return (
    <>
      <Navbar />
      <ExpertDetailClient expert={expert} profile={profile} categories={categoriesData || []} workshops={workshops || []} />
    </>
  )
}
