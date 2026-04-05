import { Navbar } from "@/components/navbar"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { WorkshopStartClient } from "@/components/workshops/WorkshopStartClient"
import { notFound } from "next/navigation"

export default async function WorkshopStartPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()

  const { data: workshop, error } = await supabase.from("workshops").select("*").eq("id", params.id).single()

  if (error || !workshop) {
    console.error("[v0] Error fetching workshop:", error)
    notFound()
  }

  return (
    <>
      <Navbar />
      <WorkshopStartClient workshop={workshop} />
    </>
  )
}
