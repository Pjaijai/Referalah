import React from "react"

import useUserStore from "@/hooks/state/user/store"
import { Icons } from "@/components/icons"

const MessageIcon = () => {
  const hasConversationUnseen = useUserStore(
    (state) => state.hasConversationUnseen
  )
  return (
    <div className="relative">
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
