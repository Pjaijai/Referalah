import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface IBaseAvatar {
  url: string
  alt: string
  fallBack: string
}
const BaseAvatar: React.FunctionComponent<IBaseAvatar> = ({
  alt,
  fallBack,
  url,
}) => {
  return (
    <Avatar>
      <AvatarImage src={url} alt={alt} />=
      <AvatarFallback>{fallBack}</AvatarFallback>
    </Avatar>
  )
}

export default BaseAvatar
