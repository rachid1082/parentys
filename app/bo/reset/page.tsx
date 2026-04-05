"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase-browser"; // <-- FIX THIS PATH

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<"idle" | "processing" | "error" | "success">("idle");
  const [message, setMessage] = useState<string>("");

  const log = (...args: any[]) => console.log("[RESET DEBUG]", ...args);

  useEffect(() => {
    log("Component mounted");

    if (typeof window === "undefined") {
      log("Window undefined — aborting");
      return;
    }

    const supabase = createClient();
    log("Supabase client created");

    const hash = window.location.hash;
    log("WINDOW LOCATION:", window.location.href);
    log("HASH RAW:", hash);

    if (!hash || hash.length < 10) {
      log("No hash found — aborting");
      setStatus("error");
      setMessage("Invalid or missing reset token.");
      return;
    }

    const params = new URLSearchParams(hash.replace("#", ""));
    const accessToken = params.get("access_token");
    const type = params.get("type");

    log("EXTRACTED access_token:", accessToken);
    log("EXTRACTED type:", type);

    if (!accessToken || type !== "recovery") {
      log("Missing token or wrong type — aborting");
      setStatus("error");
      setMessage("Invalid or expired reset link.");
      return;
    }

    setStatus("processing");
    setMessage("Validating reset link…");

    setTimeout(async () => {
      log("Starting PKCE exchange after delay");

      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(accessToken);

        log("exchangeCodeForSession RESULT:", { data, error });

        if (error) {
          log("PKCE ERROR:", error);
          setStatus("error");
          setMessage("Invalid or expired reset link.");
          return;
        }

        log("PKCE SUCCESS — session established:", data);
        setStatus("success");
        setMessage("Reset link validated. You may now set a new password.");

      } catch (err) {
        log("UNEXPECTED EXCEPTION:", err);
        setStatus("error");
        setMessage("Unexpected error during password reset.");
      }
    }, 250);

  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Reset Password</h1>

      {status === "idle" && <p>Preparing reset flow…</p>}
      {status === "processing" && <p>{message}</p>}
      {status === "success" && (
        <p>
          {message}
          <br />
          You can now enter your new password.
        </p>
      )}
      {status === "error" && (
        <p style={{ color: "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}
