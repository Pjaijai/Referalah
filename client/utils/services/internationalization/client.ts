"use client"

// doc : https://next-international.vercel.app/docs
import { createI18nClient } from "next-international/client"

export const {
  useI18n,
  useScopedI18n,
  I18nProviderClient,
  useChangeLocale,
  useCurrentLocale,
} = createI18nClient({
  "en-ca": () => import("./messages/en-ca"),
  "zh-hk": () => import("./messages/zh-hk"),
})
