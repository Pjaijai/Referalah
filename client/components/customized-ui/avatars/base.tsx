import React from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface IBaseAvatar {
  url?: string
  alt: string | null
  fallBack: string | null
  size?: "large"
  className?: string
}
const BaseAvatar: React.FunctionComponent<IBaseAvatar> = ({
  alt,
  fallBack,
  url,
  size,
  className,
}) => {
  return (
    <Avatar
      className={cn(size === "large" ? "w-24 h-24 text-2xl" : "", className)}
    >
      <AvatarImage src={url ? url : ""} alt={alt ? alt : ""} />
      <AvatarFallback>{fallBack}</AvatarFallback>
    </Avatar>
  )
}

export default BaseAvatar
