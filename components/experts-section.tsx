"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { resolveField, isRTL } from "@/lib/i18n-helpers"

type Expert = {
  id: string
  avatar_url: string | null
  headline_en: string | null
  headline_fr: string | null
  headline_ar: string | null
  bio_en: string | null
  bio_fr: string | null
  bio_ar: string | null
  status: string
  profile_id: string
  profiles?: {
    full_name: string | null
  }
}

export function ExpertsSection() {
  const { language } = useLanguage()
  const [experts, setExperts] = useState<Expert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExperts() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("experts")
          .select("*, profiles(full_name)")
          .eq("status", "approved")
          .limit(4)

        if (error) {
          console.error("[v0] Error fetching experts:", error)
          return
        }

        setExperts(data || [])
      } catch (err) {
        console.error("[v0] Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchExperts()
  }, [])

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const rtl = isRTL(language)

  return (
    <section id="experts" className="py-20 md:py-28 bg-[#C9CEC0]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {t("meetExperts", language)}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("learnFromExpertsDesc", language)}</p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading experts...</div>
        ) : experts.length === 0 ? (
          <div className="text-center text-muted-foreground">No experts available at the moment.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {experts.map((expert) => {
              const name = expert.profiles?.full_name || "Expert"
              const headline = resolveField(expert, "headline", language) || ""

              return (
                <Link key={expert.id} href={`/experts/${expert.id}`} className="block">
                  <Card className="overflow-hidden transition-all hover:shadow-lg h-full cursor-pointer">
                    <CardHeader className="text-center" dir={rtl ? "rtl" : "ltr"}>
                      <div className="mx-auto mb-4 relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={expert.avatar_url || "/placeholder.svg"} alt={name} />
                          <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                            {getInitials(name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 rounded-full bg-primary p-1.5">
                          <Award className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                      <CardTitle className="text-xl">{name}</CardTitle>
                      <CardDescription className="font-medium text-primary">{headline}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-4 flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Button asChild variant="outline" className="rounded-full px-6 bg-transparent">
            <Link href="/experts">{t("moreExperts", language)}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
