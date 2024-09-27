import "@/styles/globals.css"
import { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import NavFooter from "@/components/customized-ui/footer/nav"
import GoogleAnalytics from "@/components/google-analytics"
import Provider from "@/components/providers"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"

export const metadata: Metadata = {
  keywords: [
    "Referalah",
    "Hong Kong",
    "Hong Kong referral",
    "job referrals",
    "referee",
    "referrer",
    "香港",
    "香港人",
    "海外",
  ],
  manifest: "../manifest.json",
  title: {
    default: `${siteConfig.name} | 海外港人搵Referral平台`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
    { color: "#ffffff" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      <head />
      <body
        className={cn(
          "min-h-screen bg-gray-50 font-openSans antialiased",
          fontSans.variable
        )}
      >
        <GoogleAnalytics />

        <Provider locale={locale}>
          <div className="flex min-h-screen flex-col ">
            <SiteHeader />
            <div className="flex-1 overflow-hidden">{children}</div>
            <NavFooter />
          </div>
          <Analytics />
          <SpeedInsights />
          <TailwindIndicator />
        </Provider>
      </body>
    </html>
  )
}
