"use client"

import { createBrowserClient } from "@supabase/ssr"

// ❗ IMPORTANT:
// No fallback values. No silent switching.
// PKCE tokens MUST be validated against the SAME project that issued them.

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "These must be set in your environment for PKCE to work."
    )
  }

  return createBrowserClient(url, anon)
}
