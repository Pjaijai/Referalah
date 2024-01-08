import React from "react"
import { useSearchParams } from "next/navigation"
import ConversationList from "@/modules/chat/components/lists/conversation/conversation"

import { cn } from "@/lib/utils"

const ChatLeftSection = () => {
  const param = useSearchParams()
  const conversation = param.get("conversation")
  return (
    <div
      className={cn(
        "p-2 ",
        !!conversation
          ? "hidden md:block md:w-[35%] md:border-r"
          : "xs:block block w-full md:w-[35%] md:border-r"
      )}
    >
      <ConversationList />
    </div>
  )
}

export default ChatLeftSection
