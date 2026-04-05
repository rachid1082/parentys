// lib/supabase.ts
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// BROWSER CLIENT (PKCE ENABLED)
export function createClient(): SupabaseClient {
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: false,
    },
  });
}

// OPTIONAL: server-side client (if needed elsewhere)
export function createServerSupabaseClient(cookies: () => string) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookies()
          .split(";")
          .map((c) => {
            const [name, ...rest] = c.trim().split("=");
            return { name, value: rest.join("=") };
          });
      },
      setAll() {
        // no-op unless you need SSR auth
      },
    },
  });
}
