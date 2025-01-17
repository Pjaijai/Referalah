"use client"

import React from "react"
import {
  useChangeLocale,
  useCurrentLocale,
} from "@/utils/services/internationalization/client"

import { ELocale } from "@/types/common/locale"
import useLocaleList from "@/hooks/common/locale-list"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LocaleDropDownMenu = () => {
  const locale = useCurrentLocale()

  const changeLocale = useChangeLocale({ preserveSearchParams: true })

  const locales = useLocaleList()
  const currentLocale = locales.find((opt) => opt.value === locale)

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
        {locales.map((opt) => {
          return (
            <DropdownMenuItem>
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
