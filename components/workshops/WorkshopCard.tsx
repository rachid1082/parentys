"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface WorkshopCardProps {
  id: string
  slug?: string
  imageUrl?: string
  title: string
  shortDescription: string
  ageRange?: string
  duration?: string
  difficulty?: string
  availabilityStatus?: string
  lang: "en" | "fr" | "ar"
}

export function WorkshopCard({
  id,
  slug,
  imageUrl,
  title,
  shortDescription,
  ageRange,
  duration,
  difficulty,
  availabilityStatus,
  lang,
}: WorkshopCardProps) {
  const workshopUrl = slug ? `/workshops/${slug}` : `/workshops/${id}`

  // Availability badge logic
  const getAvailabilityBadge = () => {
    switch (availabilityStatus) {
      case "evergreen":
        return {
          label: lang === "en" ? "Start now" : lang === "fr" ? "Commencer maintenant" : "Bda daba",
          variant: "default" as const,
        }
      case "online_cohort":
      case "onsite_cohort":
        return {
          label:
            lang === "en"
              ? "Join the waitlist"
              : lang === "fr"
                ? "Rejoindre la liste d'attente"
                : "Zid smiytek f‑l‑lîst",
          variant: "secondary" as const,
        }
      default:
        return {
          label: lang === "en" ? "Learn more" : lang === "fr" ? "En savoir plus" : "3ref kter",
          variant: "outline" as const,
        }
    }
  }

  const availabilityBadge = getAvailabilityBadge()

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={imageUrl || "https://source.unsplash.com/featured/?parenting,workshop"}
            alt={title || "Workshop image"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-balance">{title || "Untitled Workshop"}</CardTitle>
        <CardDescription className="text-pretty">{shortDescription || "No description available"}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {ageRange && (
            <Badge variant="outline" className="bg-background">
              {ageRange}
            </Badge>
          )}
          {duration && (
            <Badge variant="outline" className="bg-background">
              {duration}
            </Badge>
          )}
          {difficulty && (
            <Badge variant="outline" className="bg-background">
              {difficulty}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Link href={workshopUrl} className="w-full">
          <Button variant={availabilityBadge.variant} className="w-full rounded-full">
            {availabilityBadge.label}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
