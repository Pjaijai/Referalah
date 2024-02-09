import React from "react"

import { cn } from "@/lib/utils"
import useUserStore from "@/hooks/state/user/store"
import { Icons } from "@/components/icons"

interface IMessageIconProp {
  className?: string
  variant?: "outlined" | "filled"
}
const MessageIcon: React.FunctionComponent<IMessageIconProp> = ({
  className,
  variant = "filled",
}) => {
  const hasConversationUnseen = useUserStore(
    (state) => state.hasConversationUnseen
  )
  return (
    <div className={cn("relative", className)}>
      {variant === "outlined" ? <Icons.messageSquareMore /> : <Icons.chat />}
      {hasConversationUnseen && (
        <Icons.unseenDot className="absolute right-0 top-0" />
      )}
    </div>
  )
}

export default MessageIcon
