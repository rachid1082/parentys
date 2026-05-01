"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/translations"
import Link from "next/link"

const LANGUAGES = [
  { label: "English (EN)", value: "en" as const, short: "EN" },
  { label: "Français (FR)", value: "fr" as const, short: "FR" },
  { label: "الدارجة (MA – Darija)", value: "ar" as const, short: "MA" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage } = useLanguage()

  const getLanguageLabel = () => {
    const lang = LANGUAGES.find((l) => l.value === language)
    return lang?.short || "FR"
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <img
              src="https://eemnjizfrqobmcbcmwjf.supabase.co/storage/v1/object/public/assets/brand/logo/main/Main%20Logo%20Parentys.jpg"
              alt="Parentys"
              className="hidden h-10 w-auto md:block"
            />
            <img
              src="https://eemnjizfrqobmcbcmwjf.supabase.co/storage/v1/object/public/assets/brand/logo/symbol/Logo_Perfil%20Image.jpg"
              alt="Parentys"
              className="h-12 w-12 rounded-full object-cover md:hidden"
            />
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors font-display"
            >
              {t("home", language)}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors font-display"
            >
              {t("about", language)}
            </Link>
            <Link
              href="/#experts"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors font-display"
            >
              {t("experts", language)}
            </Link>
            <Link
              href="/#workshops"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors font-display"
            >
              {t("workshops", language)}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors font-display"
            >
              {t("contact", language)}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/bo/login"
            className="hidden text-sm font-medium text-foreground hover:text-primary transition-colors font-display md:block"
          >
            {language === "fr" ? "Login Partenaires" : "Partners Login"}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden gap-1 md:flex font-display">
                {getLanguageLabel()}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  className={language === lang.value ? "bg-accent" : ""}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors font-display"
            >
              {t("home", language)}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors font-display"
            >
              {t("about", language)}
            </Link>
            <Link
              href="/#experts"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors font-display"
            >
              {t("experts", language)}
            </Link>
            <Link
              href="/#workshops"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors font-display"
            >
              {t("workshops", language)}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors font-display"
            >
              {t("contact", language)}
            </Link>
            <Link
              href="/bo/login"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors font-display"
            >
              {language === "fr" ? "Login Partenaires" : "Partners Login"}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-fit gap-1 bg-transparent font-display">
                  {getLanguageLabel()}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang.value}
                    onClick={() => setLanguage(lang.value)}
                    className={language === lang.value ? "bg-accent" : ""}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </nav>
  )
}
