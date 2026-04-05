// lib/supabase.ts
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const FALLBACK_SUPABASE_URL = "https://eemnjizfrqobmcbcmwjf.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlbW5qaXpmcnFvYm1jYmNtd2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTA4NDEsImV4cCI6MjA5MDM2Njg0MX0.5WHnYyMolTkdbVjO_tKSjAAEoFRz82_oxLvdoZHgvXI";

export function createClient(): SupabaseClient {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabaseUrl = envUrl || FALLBACK_SUPABASE_URL;
  const supabaseKey = envKey || FALLBACK_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("[Supabase] Missing environment variables:", {
      url: supabaseUrl ? "set" : "MISSING",
      key: supabaseKey ? "set" : "MISSING",
    });
    throw new Error(
      "Supabase environment variables are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey, {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: false,
    },
  });
}
