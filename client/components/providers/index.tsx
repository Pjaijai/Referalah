"use client"

import React from "react"
import { I18nProviderClient } from "@/utils/services/internationalization/client"
import { ThemeProvider } from "next-themes"

import APIProvider from "@/components/providers/api"
import AuthProvider from "@/components/providers/auth"
import ToastProvider from "@/components/providers/toast"

interface IProviderProps {
  children: React.ReactNode
  locale: string
}
const Provider: React.FunctionComponent<IProviderProps> = ({
  children,
  locale,
}) => {
  return (
    // <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <APIProvider>
        <I18nProviderClient locale={locale}>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </I18nProviderClient>
      </APIProvider>
    </ThemeProvider>
  )
}

export default Provider
