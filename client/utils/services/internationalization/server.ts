import { createI18nServer } from "next-international/server"

export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer({
  "en-ca": () => import("./messages/en-ca"),
  "zh-hk": () => import("./messages/zh-hk"),
})
