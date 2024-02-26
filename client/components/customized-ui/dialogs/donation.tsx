"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useI18n } from "@/utils/services/internationalization/client"

import useUserStore from "@/hooks/state/user/store"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Icons } from "@/components/icons"

const DonationDialog = () => {
  const isDonationDialogOpen = useUserStore(
    (state) => state.isDonationDialogOpen
  )
  const setIsDonationDialogOpen = useUserStore(
    (state) => state.setIsDonationDialogOpen
  )
  const t = useI18n()

  const handleOpenChange = (isOpen: boolean) => {
    setIsDonationDialogOpen(isOpen)
    localStorage.setItem("isDonationDialogOpen", String(isOpen))
  }

  useEffect(() => {
    const res = localStorage.getItem("isDonationDialogOpen")

    if (res === "false") return

    setIsDonationDialogOpen(true)
    localStorage.setItem("isDonationDialogOpen", String(true))
  }, [])

  return (
    <Dialog open={isDonationDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="outline-none" showCross={true}>
        <DialogHeader>
          <DialogTitle>{t("general.support_us.title")}</DialogTitle>
          <DialogDescription>
            {t("general.support_us.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="items-around flex flex-row justify-around ">
          <Link
            rel="noopener noreferrer "
            target="_blank"
            href={"https://github.com/sponsors/Pjaijai"}
            className={buttonVariants({ variant: "default" })}
          >
            <Icons.github />
            <p>Github sponsor</p>
          </Link>

          <a
            href="https://www.buymeacoffee.com/paulwong169"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              alt="Buy Me A Coffee"
              className="h-10"
            />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DonationDialog
