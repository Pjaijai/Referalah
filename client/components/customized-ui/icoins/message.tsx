import React from "react"

import { cn } from "@/lib/utils"
import useUserStore from "@/hooks/state/user/store"
import { Icons } from "@/components/icons"

interface IMessageIconProp {
  className?: string
}
const MessageIcon: React.FunctionComponent<IMessageIconProp> = ({
  className,
}) => {
  const hasConversationUnseen = useUserStore(
    (state) => state.hasConversationUnseen
  )
  return (
    <div className={cn("relative", className)}>
      <Icons.messageSquareMore />
      {hasConversationUnseen && (
        <Icons.bigDot
          className="absolute right-0 top-0 -translate-y-2 translate-x-2 text-green-700 dark:text-yellow-300"
          width="24"
          height="24"
        />
      )}
    </div>
  )
}

export default MessageIcon
