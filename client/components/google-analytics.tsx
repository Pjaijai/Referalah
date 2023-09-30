"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Script from "next/script"

declare const window: any

export default function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    const url = pathname

    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string, {
      page_path: url,
    })
  }, [pathname, process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID])

  return (
    <>
      <script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                      page_path: window.location.pathname,
                      });
                    `,
        }}
      />
    </>
  )
}
