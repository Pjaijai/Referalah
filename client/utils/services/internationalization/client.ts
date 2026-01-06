"use client"

// doc : https://next-international.vercel.app/docs
import { createI18nClient } from "next-international/client"

import { ELocale } from "@/types/common/enums/locale"

export const {
  useI18n,
  useScopedI18n,
  I18nProviderClient,
  useChangeLocale,
  useCurrentLocale,
} = createI18nClient({
  [ELocale.EN_CA]: () => import("./messages/en-ca"),
  [ELocale.ZH_HK]: () => import("./messages/zh-hk"),
  [ELocale.ZH_TW]: () => import("./messages/zh-tw"),
})
