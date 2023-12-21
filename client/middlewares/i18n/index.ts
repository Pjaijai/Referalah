import { NextRequest } from "next/server"
import { createI18nMiddleware } from "next-international/middleware"

const I18nMiddleware = createI18nMiddleware({
  locales: ["en-ca", "zh-hk"],
  defaultLocale: "en-ca",
})

export function i18nMiddleware(request: NextRequest) {
  return I18nMiddleware(request)
}
