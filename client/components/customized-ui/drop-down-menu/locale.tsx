"use client"

import React from "react"
import {
  useChangeLocale,
  useCurrentLocale,
} from "@/utils/services/internationalization/client"

import { ELocale } from "@/types/common/enums/locale"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LocaleDropDownMenu = () => {
  const locale = useCurrentLocale()

  const changeLocale = useChangeLocale({ preserveSearchParams: true })
  const options = [
    { value: ELocale.ZH_HK, location: "香港", icon: "🇭🇰", lang: "廣東話" },
    { value: ELocale.ZH_TW, location: "台灣", icon: "🇹🇼", lang: "中文" },
    { value: ELocale.EN_CA, location: "Canada", icon: "🇨🇦", lang: "English" },
  ] as const
  const currentLocale = options.find((opt) => opt.value === locale)

  const handleLocalChange = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: ELocale
  ) => {
    changeLocale(value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex shrink-0 flex-row items-center justify-center gap-1 text-sm">
        <p>{currentLocale?.icon}</p>
        <p>({currentLocale?.lang})</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((opt, index) => {
          return (
            <DropdownMenuItem key={index}>
              <button
                onClick={(e) => handleLocalChange(e, opt.value)}
                className="flex w-full flex-row items-center justify-start gap-1"
              >
                <p>{opt.icon}</p>
                <p>{opt.location} </p>
                <p>({opt.lang})</p>
              </button>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LocaleDropDownMenu
