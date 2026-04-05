"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("en")

  useEffect(() => {
    const lang = localStorage.getItem("qp_lang") || "en"
    setCurrentLang(lang)
  }, [])

  const switchLanguage = (lang: string) => {
    localStorage.setItem("qp_lang", lang)
    window.location.reload()
  }

  return (
    <div className="flex gap-2 bg-background/95 backdrop-blur-sm border rounded-full p-1 shadow-lg">
      <Button
        variant={currentLang === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => switchLanguage("en")}
        className="rounded-full"
      >
        EN
      </Button>
      <Button
        variant={currentLang === "fr" ? "default" : "ghost"}
        size="sm"
        onClick={() => switchLanguage("fr")}
        className="rounded-full"
      >
        FR
      </Button>
      <Button
        variant={currentLang === "ar" ? "default" : "ghost"}
        size="sm"
        onClick={() => switchLanguage("ar")}
        className="rounded-full"
      >
        AR
      </Button>
    </div>
  )
}
