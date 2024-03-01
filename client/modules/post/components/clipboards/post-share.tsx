"use client"

import React, { useState } from "react"

import { cn } from "@/lib/utils"
import BaseClipboard from "@/components/customized-ui/clipboards/base"
import { Icons } from "@/components/icons"

const PostShareClipboard = () => {
  const [isClicked, setIsClicked] = useState(false)

  const onCopy = async () => {
    setIsClicked(true)
  }
  return (
    <BaseClipboard onCopy={onCopy} textValue={window.location.href}>
      <button
        className={cn(
          "flex flex-row items-center justify-center space-x-1 border-b border-muted-foreground text-sm"
        )}
      >
        {isClicked ? (
          <>
            <p>Copied</p>
            <Icons.copyCheck height={20} width={20} />
          </>
        ) : (
          <>
            <p>Copy Link</p> <Icons.copy height={20} width={20} />
          </>
        )}
      </button>
    </BaseClipboard>
  )
}

export default PostShareClipboard
