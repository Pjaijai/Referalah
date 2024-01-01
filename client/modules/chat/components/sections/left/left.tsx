import React from "react"
import ConversationList from "@/modules/chat/components/lists/conversation.tsx/conversation"

const ChatLeftSection = () => {
  return (
    <div className="w-[35%] p-2">
      <ConversationList />
    </div>
  )
}

export default ChatLeftSection
