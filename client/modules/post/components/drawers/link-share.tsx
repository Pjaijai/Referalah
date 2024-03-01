"use client"

import React from "react"
import {
  EmailShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import BaseClipboard from "@/components/customized-ui/clipboards/base"
import { Icons } from "@/components/icons"

const LinkShareDrawer = () => {
  const url = typeof window !== "undefined" ? window.location.href : ""

  return (
    <Drawer>
      <DrawerTrigger>
        <Icons.send />
      </DrawerTrigger>
      <DrawerContent className="px-2 pb-8">
        <DrawerHeader>
          <DrawerTitle>Share to</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-row items-center justify-around p-4">
          <BaseClipboard
            afterCopyContent={
              <>
                <Icons.copy height={30} width={30} />
              </>
            }
            beforeCopyContent={
              <>
                <Icons.copyCheck height={30} width={30} />
              </>
            }
            textValue={window.location.href}
          />
          <WhatsappShareButton url={url}>
            <Icons.whatsapp width={30} height={30} />
          </WhatsappShareButton>
          <TelegramShareButton url={url}>
            <Icons.telegram height={30} width={30} />
          </TelegramShareButton>
          <EmailShareButton url={url}>
            <Icons.mail height={30} width={30} />
          </EmailShareButton>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default LinkShareDrawer
