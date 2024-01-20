import { url } from "inspector"
import React from "react"
import {
  useChangeLocale,
  useCurrentLocale,
} from "@/utils/services/internationalization/client"
import { Link } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

const LocaleDropDownMenu = () => {
  const locale = useCurrentLocale()
  const changeLocale = useChangeLocale()
  const options = [
    { value: "zh-hk", location: "香港", icon: "🇭🇰", lang: "廣東話" },
    { value: "en-ca", location: "Canada", icon: "🇨🇦", lang: "English" },
  ] as const
  const currentLocale = options.find((opt) => opt.value === locale)

  const handleLocalChange = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: "zh-hk" | "en-ca"
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
        {options.map((opt) => {
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
