import React from "react"
import { useSearchParams } from "next/navigation"
import SendMessageForm from "@/modules/chat/components/forms/message/message"
import ConversationHeader from "@/modules/chat/components/header/conversation/conversation"
import MessageList from "@/modules/chat/components/lists/message/message"

const ChatRightSection = () => {
  const param = useSearchParams()
  const conversation = param.get("conversation")

  return (
    <div className="flex w-[65%] flex-col">
      <ConversationHeader
        username="on99"
        companyName={"Referalah"}
        jobTitle={"Free Rider"}
      />
      <MessageList conversationUuid={conversation} />
      <SendMessageForm conversationUuid={conversation} />
    </div>
  )
}

export default ChatRightSection
