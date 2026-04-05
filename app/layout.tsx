export const dynamic = "force-dynamic"

import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans, Plus_Jakarta_Sans, Marck_Script } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/contexts/language-context"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
})

const marckScript = Marck_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-accent",
})

export const metadata: Metadata = {
  title: "Parentys - With you, from bump to baby and beyond",
  description: "Trusted experts and supportive content for every step of your parenting journey.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${ibmPlexSans.variable} ${marckScript.variable} font-sans antialiased`}
      >
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
