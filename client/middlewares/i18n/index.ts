import { NextRequest } from "next/server"
import { createI18nMiddleware } from "next-international/middleware"

import { ELocale } from "@/types/common/enums/locale"

const I18nMiddleware = createI18nMiddleware({
  locales: Object.values(ELocale),
  defaultLocale: ELocale.EN_CA,
})

export function i18nMiddleware(request: NextRequest) {
  return I18nMiddleware(request)
}
