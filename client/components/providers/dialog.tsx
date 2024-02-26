"use client"

import React from "react"

import DonationDialog from "@/components/customized-ui/dialogs/donation"

interface IDialogProviderProps {
  children: React.ReactNode
}

const DialogProvider: React.FunctionComponent<IDialogProviderProps> = ({
  children,
}) => {
  return (
    <>
      <DonationDialog />
      {children}
    </>
  )
}

export default DialogProvider
