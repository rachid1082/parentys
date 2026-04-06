// lib/supabase.ts
"use client"

import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js"

// ---------------------------------------------------------
// 🔥 GLOBAL LOGGER
// ---------------------------------------------------------
const L = (...args: any[]) =>
  console.log(`[SUPABASE-CLIENT][${new Date().toISOString()}]`, ...args)

const FALLBACK_SUPABASE_URL = "https://eemnjizfrqobmcbcmwjf.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlbW5qaXpmcnFvYm1jYmNtd2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA4NDEsImV4cCI6MjA5MDM2Njg0MX0.5WHnYyMolTkdbVjO_tKSjAAEoFRz82_oxLvdoZHgvXI"

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabaseUrl = envUrl || FALLBACK_SUPABASE_URL
const supabaseKey = envKey || FALLBACK_SUPABASE_ANON_KEY

L("INIT: Using Supabase URL:", supabaseUrl)
L("INIT: Using Supabase ANON KEY (first 10 chars):", supabaseKey.slice(0, 10))

let browserClient: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  L("createClient() called")

  if (browserClient) {
    L("Returning existing browserClient instance")
    return browserClient
  }

  const storageAvailable =
    typeof window !== "undefined" && !!window.localStorage

  L("Storage available:", storageAvailable)
  L("localStorage keys:", storageAvailable ? Object.keys(localStorage) : "N/A")

  // ---------------------------------------------------------
  // 🔥 CREATE CLIENT WITH FULL LOGGING
  // ---------------------------------------------------------
  L("Creating NEW Supabase client with config:", {
    url: supabaseUrl,
    key: supabaseKey.slice(0, 10) + "...",
    auth: {
      flowType: "pkce",
      detectSessionInUrl: false,
      persistSession: true, // ⭐ REQUIRED FOR SESSION TO SURVIVE
      storage: storageAvailable ? "localStorage" : "undefined",
    },
  })

  browserClient = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: false,
      persistSession: true, // ⭐ THIS FIXES YOUR 403
      storage: storageAvailable ? window.localStorage : undefined,
    },
  })

  // ---------------------------------------------------------
  // 🔥 LOG CURRENT SESSION (if any)
  // ---------------------------------------------------------
  browserClient.auth.getSession().then((sessionRes) => {
    L("Initial getSession() result:", sessionRes)
  })

  // ---------------------------------------------------------
  // 🔥 LISTEN TO AUTH EVENTS
  // ---------------------------------------------------------
  browserClient.auth.onAuthStateChange((event, session) => {
    L("AUTH EVENT:", event)
    L("AUTH SESSION:", session)
    if (session?.access_token) {
      L("ACCESS TOKEN (first 20 chars):", session.access_token.slice(0, 20))
    }
  })

  return browserClient
}
