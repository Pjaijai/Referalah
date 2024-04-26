import React from "react"
import Link from "next/link"
import { useI18n } from "@/utils/services/internationalization/client"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface IUserSignInDialogProps {
  open: boolean
  onDialogClose: () => void
}

const UserSignInDialog = ({ open, onDialogClose }: IUserSignInDialogProps) => {
  const t = useI18n()
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("referral.user_not_sing_in_dialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("referral.user_not_sing_in_dialog.description")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex gap-2">
          <Button onClick={onDialogClose} variant={"ghost"}>
            {t("referral.user_not_sing_in_dialog.cancel")}
          </Button>
          <Link href={siteConfig.page.signIn.href} className={buttonVariants()}>
            {t("general.sign_in")}
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UserSignInDialog
