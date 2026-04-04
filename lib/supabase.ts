"use client"

import { createBrowserClient } from "@supabase/ssr"

// Fallback values for v0 preview environment where env vars may not persist
const FALLBACK_SUPABASE_URL = "https://eemnjizfrqobmcbcmwjf.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlbW5qaXpmcnFvYm1jYmNtd2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA4NDEsImV4cCI6MjA5MDM2Njg0MX0.5WHnYyMolTkdbVjO_tKSjAAEoFRz82_oxLvdoZHgvXI"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY

  return createBrowserClient(supabaseUrl, supabaseKey)
}
