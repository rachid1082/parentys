import { Navbar } from "@/components/navbar"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { ExpertsListClient } from "@/components/experts/ExpertsListClient"

export default async function ExpertsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: experts, error } = await supabase.from("experts").select("*").order("name_en", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching experts:", error)
  }

  return (
    <>
      <Navbar />
      <ExpertsListClient experts={experts || []} />
    </>
  )
}
