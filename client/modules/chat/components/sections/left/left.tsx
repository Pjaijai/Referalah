import React from "react"
import { useSearchParams } from "next/navigation"
import ConversationList from "@/modules/chat/components/lists/conversation.tsx/conversation"

import { cn } from "@/lib/utils"

const ChatLeftSection = () => {
  const param = useSearchParams()
  const conversation = param.get("conversation")
  return (
    <div
      className={cn(
        "p-2",
        !!conversation
          ? "hidden md:block md:w-[35%]"
          : "xs:block block w-full md:w-[35%]"
      )}
    >
      <ConversationList />
    </div>
  )
}

export default ChatLeftSection
