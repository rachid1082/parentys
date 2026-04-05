"use client"

import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/translations"
import Link from "next/link"

export function Footer() {
  const { language } = useLanguage()

  return (
    <footer className="border-t border-border bg-secondary/20 py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src="https://tznhipxlrohslxbrdrnm.supabase.co/storage/v1/object/public/assets/brand/logo/symbol/Logo_Perfil%20Image.jpg"
                alt="Parentys"
                className="h-12 w-12 rounded-full object-cover"
              />
              <span className="text-xl font-bold text-foreground font-display">Parentys</span>
            </div>
            <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
              {t("workshopsGuidance", language)}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground font-display">{t("quickLinks", language)}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  {t("home", language)}
                </Link>
              </li>
              <li>
                <Link href="/workshops" className="hover:text-primary transition-colors">
                  {t("workshops", language)}
                </Link>
              </li>
              <li>
                <Link href="/experts" className="hover:text-primary transition-colors">
                  {t("experts", language)}
                </Link>
              </li>
              <li>
                <Link href="/quickpath" className="hover:text-primary transition-colors">
                  {t("quickpath", language)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground font-display">{t("support", language)}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#faq" className="hover:text-primary transition-colors">
                  {t("faq", language)}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  {t("contact", language)}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  {t("aboutUs", language)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground font-display">{t("legal", language)}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("privacyPolicy", language)}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("termsOfService", language)}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © Parentys 2026. {t("madeWithLove", language)}
        </div>
      </div>
    </footer>
  )
}
