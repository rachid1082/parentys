"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase"
import { resolveField, isRTL } from "@/lib/i18n-helpers"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/translations"

type Workshop = {
  id: string
  title_en: string
  description_en: string
  banner_url: string
  starts_at: string
  price_cents: number
  currency: string
  status: string
  title?: string // Added for fallback logic
  description?: string // Added for fallback logic
}

export function WorkshopsSection() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const { language: userLang } = useLanguage()

  useEffect(() => {
    async function fetchWorkshops() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("workshops")
          .select("*")
          .eq("status", "published")
          .order("starts_at", { ascending: true })

        if (error) {
          console.error("[v0] Error fetching workshops:", error)
          return
        }

        setWorkshops(data || [])
      } catch (err) {
        console.error("[v0] Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshops()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatPrice = (cents: number, currency: string) => {
    return `${(cents / 100).toFixed(0)} ${currency}`
  }

  return (
    <section id="workshops" className="py-20 md:py-28 bg-[#F5F1E6]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {t("upcomingWorkshops", userLang)}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("upcomingWorkshopsDesc", userLang)}</p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading workshops...</div>
        ) : workshops.length === 0 ? (
          <div className="text-center text-muted-foreground">{t("noWorkshops", userLang)}</div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {workshops.map((workshop) => {
                const title = resolveField(workshop, "title", userLang) || "Untitled workshop"
                const description = resolveField(workshop, "description", userLang) || "No description available"
                const rtl = isRTL(userLang)

                return (
                  <Card key={workshop.id} className="overflow-hidden transition-all hover:shadow-lg">
                    <img
                      src={workshop.banner_url || "https://source.unsplash.com/featured/?parenting"}
                      alt={title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div dir={rtl ? "rtl" : "ltr"}>
                      <CardHeader className={rtl ? "text-right" : ""}>
                        <CardTitle className="text-balance">{title}</CardTitle>
                        <CardDescription className="text-pretty">{description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                          <div className={`flex items-center gap-2 ${rtl ? "flex-row-reverse" : ""}`}>
                            📅 {formatDate(workshop.starts_at)}
                          </div>
                          <div className={`flex items-center gap-2 ${rtl ? "flex-row-reverse" : ""}`}>
                            <span className="font-semibold text-primary">
                              {formatPrice(workshop.price_cents, workshop.currency)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/workshops/${workshop.id}`} className="w-full">
                          <Button className="w-full rounded-full bg-transparent" variant="outline">
                            {t("viewDetails", userLang)}
                          </Button>
                        </Link>
                      </CardFooter>
                    </div>
                  </Card>
                )
              })}
            </div>
            <div className="flex justify-center mt-8">
              <Button asChild variant="outline" className="rounded-full px-6 bg-transparent">
                <Link href="/workshops">{t("moreWorkshops", userLang)}</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
