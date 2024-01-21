"use client"

import * as React from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"

export function ThemeToggleMobile() {
  const t = useI18n()
  const { setTheme, theme } = useTheme()

  const handleOnCheckedChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-row items-center font-semibold">
        {theme === "dark" ? <Moon /> : <Sun />}
        {theme === "dark" ? t("general.dark_mode") : t("general.light_mode")}
      </div>
      <Switch value={theme} onCheckedChange={handleOnCheckedChange} />
    </div>
  )
}
