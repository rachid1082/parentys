export const dynamic = "force-dynamic"

import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Parentys Back Office",
  description: "Back Office for Parentys",
}

export default function BOLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
