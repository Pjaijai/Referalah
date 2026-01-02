import { createI18nServer } from "next-international/server"

import { ELocale } from "@/types/common/enums/locale"

export const { getI18n, getCurrentLocale, getScopedI18n, getStaticParams } =
  createI18nServer({
    [ELocale.EN_CA]: () => import("./messages/en-ca"),
    [ELocale.ZH_HK]: () => import("./messages/zh-hk"),
    [ELocale.ZH_TW]: () => import("./messages/zh-tw"),
  })
