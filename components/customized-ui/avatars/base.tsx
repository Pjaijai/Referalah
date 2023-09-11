import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface IBaseAvatar {
  url?: string
  alt: string | null
  fallBack: string | null
  size?: "large"
}
const BaseAvatar: React.FunctionComponent<IBaseAvatar> = ({
  alt,
  fallBack,
  url,
  size,
}) => {
  return (
    <Avatar className={size === "large" ? "w-24 h-24 text-2xl" : ""}>
      <AvatarImage src={url ? url : ""} alt={alt ? alt : ""} />
      <AvatarFallback>{fallBack}</AvatarFallback>
    </Avatar>
  )
}

export default BaseAvatar
