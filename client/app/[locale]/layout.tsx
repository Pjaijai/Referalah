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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_WEB_URL || "https://referalah.com"
  ),
  title: {
    default: `${siteConfig.name} | 海外港人平台`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Referalah",
    "Hong Kong",
    "Hong Kong referral",
    "job referrals",
    "talents",
    "community",
    "connections",
    "referrer",
    "香港",
    "香港人",
    "海外",
    "overseas Hongkongers",
    "career networking",
  ],
  authors: [{ name: "Referalah Team" }],
  creator: "Referalah",
  publisher: "Referalah",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_ca",
    url: process.env.NEXT_PUBLIC_WEB_URL,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | 海外港人平台`,
    description: siteConfig.description,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_WEB_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Referalah - Overseas Hongkongers Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | 海外港人平台`,
    description: siteConfig.description,
    images: [`${process.env.NEXT_PUBLIC_WEB_URL}/twitter-image.jpg`],
    creator: "@referalah",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_WEB_URL,
    languages: {
      "en-CA": "/en-ca",
      "zh-HK": "/zh-hk",
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
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
          "min-h-screen bg-slate-50 font-openSans antialiased",
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
