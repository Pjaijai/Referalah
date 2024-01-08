import "@/styles/globals.css"
import { Metadata } from "next"
import { cookies } from "next/headers"
import { I18nProviderClient } from "@/utils/services/internationalization/client"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Analytics } from "@vercel/analytics/react"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import NavFooter from "@/components/customized-ui/footer/nav"
import GoogleAnalytics from "@/components/google-analytics"
import APIProvider from "@/components/providers/api"
import AuthProvider from "@/components/providers/auth"
import ChatProvider from "@/components/providers/chat"
import ToastProvider from "@/components/providers/toast"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

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

// do not cache this layout
export const revalidate = 0

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const accessToken = session?.access_token || null

  return (
    <html lang="zh-Hant-HK" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <GoogleAnalytics />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <APIProvider>
            <I18nProviderClient locale={locale}>
              <AuthProvider accessToken={accessToken}>
                <ChatProvider>
                  <ToastProvider>
                    <div className="flex min-h-screen flex-col">
                      <SiteHeader />
                      <div className="flex-1 overflow-auto">{children}</div>
                      <NavFooter />
                    </div>
                    <Analytics />
                    <TailwindIndicator />
                  </ToastProvider>
                </ChatProvider>
              </AuthProvider>
            </I18nProviderClient>
          </APIProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
