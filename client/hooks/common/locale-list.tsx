import { useMemo } from "react"

import { ELocale } from "@/types/common/locale"

interface ILocaleList {
  value: ELocale
  location: string
  icon: string
  lang: string
}

const useLocaleList = () => {
  return useMemo<ILocaleList[]>(() => {
    const options: ILocaleList[] = [
      {
        value: ELocale.HONG_KONG_CANTONESE,
        location: "香港",
        icon: "🇭🇰",
        lang: "廣東話",
      },
      {
        value: ELocale.CANADA_ENGLISH,
        location: "Canada",
        icon: "🇨🇦",
        lang: "English",
      },
    ] as const

    return options
  }, [])
}

export default useLocaleList
