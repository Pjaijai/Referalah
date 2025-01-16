export enum ELocale {
  HONG_KONG_CANTONESE = "zh-hk",
  CANADA_ENGLISH = "en-ca",
}

export const localValues = ["zh-hk", "en-ca"] as const

export type TLocale = (typeof localValues)[number]
