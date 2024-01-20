"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"

export function ThemeToggleMobile() {
  const { setTheme, theme } = useTheme()

  const handleOnCheckedChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center font-semibold">
        {theme === "dark" ? <Moon /> : <Sun />}
        {theme === "dark" ? "夜間模式" : "日間模式"}
      </div>
      <Switch value={theme} onCheckedChange={handleOnCheckedChange} />
    </div>
  )
}
