import { Navbar } from "@/components/navbar"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { WorkshopsListClient } from "@/components/workshops/WorkshopsListClient"

export default async function WorkshopsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: workshops, error } = await supabase.from("workshops").select("*").order("title_en", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching workshops:", error)
  }

  return (
    <>
      <Navbar />
      <WorkshopsListClient workshops={workshops || []} />
    </>
  )
}
