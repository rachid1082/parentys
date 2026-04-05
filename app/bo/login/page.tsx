const handleForgotPassword = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  setSuccess("")
  setLoading(true)

  try {
    const redirectTo = getRedirectUrl()
    console.log("[LOGIN DEBUG] Sending reset email with redirectTo:", redirectTo)

    const supabase = createClient()

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    console.log("[LOGIN DEBUG] resetPasswordForEmail RESULT:", { data, error })

    if (error) {
      console.error("[LOGIN DEBUG] resetPasswordForEmail ERROR DETAILS:", {
        name: error.name,
        message: error.message,
        status: (error as any).status,
      })
      setError("Failed to send recovery email.")
      setLoading(false)
      return
    }

    console.log("[LOGIN DEBUG] Recovery email sent successfully")
    setSuccess("A recovery email has been sent.")
    setLoading(false)
  } catch (err) {
    console.error("[LOGIN DEBUG] Unexpected error:", err)
    setError("Failed to send recovery email.")
    setLoading(false)
  }
}
