import "@/styles/globals.css"
import { Metadata } from "next"
import NavFooter from "@/components/customized-ui/footer/nav"
import APIProvider from "@/components/providers/api"
import AuthProvider from "@/components/providers/auth"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { siteConfig } from "@/config/site"
import { Analytics } from '@vercel/analytics/react';
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import GoogleAnalytics from "@/components/google-analytics"

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | 海外港人搵Referral平台`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="zh-Hk" suppressHydrationWarning>
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
              <AuthProvider>
                <div className="flex min-h-screen flex-col">
                  <SiteHeader />
                  <div className="container flex-grow">{children}</div>
                  <NavFooter />
                </div>
           
                <Analytics />
                <TailwindIndicator />
              </AuthProvider>
            </APIProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
