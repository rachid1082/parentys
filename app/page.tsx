"use client"
export const dynamic = "force-dynamic"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ValuesSection } from "@/components/values-section"
import { WorkshopsSection } from "@/components/workshops-section"
import { CategoriesSection } from "@/components/categories-section"
import { ExpertsSection } from "@/components/experts-section"
import { QuickPathSection } from "@/components/quickpath-section"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

export default function Home() {
  const { language } = useLanguage()

  const dir = language === "ar" ? "rtl" : "ltr"

  return (
    <div dir={dir}>
      <main className="min-h-screen">
        <Navbar />
        <HeroSection />
        <ValuesSection />
        <ExpertsSection />
        <WorkshopsSection />
        <CategoriesSection />
        <QuickPathSection />
        <Footer />
      </main>
    </div>
  )
}
