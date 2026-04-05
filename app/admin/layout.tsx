export const dynamic = "force-dynamic"

import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Parentys Admin",
  description: "Admin Back Office for Parentys",
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
