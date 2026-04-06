"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function ResetPage() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    console.log("[RESET DEBUG] Component mounted");

    const supabase = createClient();
    console.log("[RESET DEBUG] Supabase client created");

    console.log("[RESET DEBUG] COOKIE DEBUG: document.cookie =", document.cookie);
    console.log("[RESET DEBUG] COOKIE DEBUG: cookie names =", document.cookie.split(";").map(c => c.trim().split("=")[0]));

    const hash = window.location.hash;
    console.log("[RESET DEBUG] HASH RAW:", hash);

    const params = new URLSearchParams(hash.replace("#", ""));
    const access_token = params.get("access_token");
    const type = params.get("type");

    console.log("[RESET DEBUG] EXTRACTED access_token:", access_token);
    console.log("[RESET DEBUG] EXTRACTED type:", type);

    if (!access_token || type !== "recovery") {
      setStatus("invalid");
      return;
    }

    setTimeout(async () => {
      console.log("[RESET DEBUG] Starting PKCE exchange after delay");

      const { data, error } = await supabase.auth.exchangeCodeForSession(access_token);

      console.log("[RESET DEBUG] exchangeCodeForSession RESULT:", { data, error });

      if (error) {
        console.error("[RESET DEBUG] PKCE ERROR:", error);
        setStatus("invalid");
        return;
      }

      setStatus("success");
    }, 300);
  }, []);

  if (status === "loading") return <p>Validating reset link…</p>;
  if (status === "invalid") return <p>Invalid or expired reset link.</p>;

  return <p>Reset link validated. You may now update your password.</p>;
}
