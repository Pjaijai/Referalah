import React from "react"
import Link from "next/link"

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
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>未登入</DialogTitle>
          <DialogDescription>要登入咗先可以聯絡對方。</DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex gap-2">
          <Button onClick={onDialogClose} variant={"ghost"}>
            下次先
          </Button>
          <Link href={siteConfig.page.auth.href} className={buttonVariants()}>
            登入/註冊
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UserSignInDialog
