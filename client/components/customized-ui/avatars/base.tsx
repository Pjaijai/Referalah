import React from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface IBaseAvatar {
  url?: string
  alt: string | null
  fallBack: string | React.ReactNode | null
  size?: "large" | "medium" | "veryLarge"
  className?: string
  fallbackClassName?: string
}
const BaseAvatar: React.FunctionComponent<IBaseAvatar> = ({
  alt,
  fallBack,
  url,
  size,
  className,
  fallbackClassName,
}) => {
  return (
    <Avatar
      className={cn(
        size === "large" && "h-24 w-24 text-2xl",

        size === "medium" && "h-12 w-12 text-2xl",
        size === "veryLarge" && "h-44 w-44 text-3xl",
        className
      )}
    >
      <AvatarImage src={url ? url : ""} alt={alt ? alt : ""} />
      <AvatarFallback className={cn(fallbackClassName)}>
        {fallBack}
      </AvatarFallback>
    </Avatar>
  )
}

export default BaseAvatar
