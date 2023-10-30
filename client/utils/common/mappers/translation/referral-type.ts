import { ReferralType } from "@/types/common/referral-type"

export type ReferralTypeTranslations = {
  [key in ReferralType]: {
    zh: string
    en: string
  }
}

export const ReferralTypeTranslationMapper: ReferralTypeTranslations = {
  referer: {
    zh: "工搵人",
    en: "Referrer",
  },
  referee: {
    zh: "人搵工",
    en: "Referee",
  },
}
