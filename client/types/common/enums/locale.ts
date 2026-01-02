export enum ELocale {
  EN_CA = "en-ca",
  ZH_HK = "zh-hk",
  ZH_TW = "zh-tw",
}

export const isChineseLocale = (locale: ELocale | string) =>
  locale === ELocale.ZH_HK || locale === ELocale.ZH_TW
