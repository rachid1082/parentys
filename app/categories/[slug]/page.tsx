import { Navbar } from "@/components/navbar"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import { CategoryDetailClient } from "@/components/categories/CategoryDetailClient"

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  // Fetch category
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (categoryError || !category) {
    notFound()
  }

  // Fetch workshops linked to this category
  const { data: workshops } = await supabase
    .from("workshops")
    .select("*, experts(id, profile_id, profiles(full_name, avatar_url))")
    .eq("category_id", category.id)
    .eq("status", "published")
    .order("starts_at", { ascending: true })

  // Fetch articles linked to this category (if articles table exists)
  let articles: any[] = []
  try {
    const { data: articlesData } = await supabase
      .from("articles")
      .select("*")
      .eq("category_id", category.id)
      .eq("status", "published")
      .order("created_at", { ascending: false })
    
    if (articlesData) {
      articles = articlesData
    }
  } catch {
    // Articles table may not exist yet
  }

  return (
    <>
      <Navbar />
      <CategoryDetailClient 
        category={category} 
        workshops={workshops || []} 
        articles={articles}
      />
    </>
  )
}
