"use client"

import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("---- SUPABASE CLIENT DEBUG ----")
  console.log("ENV SUPABASE URL:", url)
  console.log("ENV SUPABASE ANON KEY (first 10 chars):", anon?.slice(0, 10))

  if (!url || !anon) {
    console.error("❌ Missing Supabase environment variables")
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  const client = createBrowserClient(url, anon)

  // @ts-ignore
  console.log("CLIENT SUPABASE URL:", client?.rest?.url)

  return client
}
