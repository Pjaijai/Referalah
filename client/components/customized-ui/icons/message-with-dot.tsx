import React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface IMessageIconProp {
  className?: string
  variant?: "outlined" | "filled"
  showDot: boolean
}
const MessageIconWithDot: React.FunctionComponent<IMessageIconProp> = ({
  className,
  variant = "filled",
  showDot,
}) => {
  return (
    <div className={cn("relative", className)}>
      {variant === "outlined" ? <Icons.messageSquareMore /> : <Icons.chat />}
      {showDot && <Icons.unseenDot className="absolute right-0 top-0" />}
    </div>
  )
}

export default MessageIconWithDot
