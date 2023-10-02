"use client"

import React, { PropsWithChildren } from "react"

import { Toaster } from "@/components/ui/toaster"

interface IToastProviderProps {}
const ToastProvider: React.FunctionComponent<
  PropsWithChildren<IToastProviderProps>
> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

export default ToastProvider
