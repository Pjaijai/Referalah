import React from "react"
import { useSearchParams } from "next/navigation"
import AcceptConversationForm from "@/modules/chat/components/forms/accept-conversation/accept-conversation"
import SendMessageForm from "@/modules/chat/components/forms/message/message"
import ConversationHeader from "@/modules/chat/components/header/conversation/conversation"
import MessageList from "@/modules/chat/components/lists/message/message"
import useConversationStore from "@/modules/chat/state/conversations"

import useUserStore from "@/hooks/state/user/store"

const ChatRightSection = () => {
  const param = useSearchParams()
  const userUuid = useUserStore((state) => state.uuid)
  const conversation = param.get("conversation")
  const conversations = useConversationStore((state) => state.conversations)
  const currentConversation = conversations.find(
    (con) => con.uuid === conversation
  )

  if (!currentConversation || !conversation) return
  return (
    <div className="flex h-full w-[65%] flex-col">
      <ConversationHeader
        avatarUrl={
          currentConversation?.sender.uuid === userUuid
            ? currentConversation.receiver.avatarUrl
            : currentConversation.sender.avatarUrl
        }
        username={
          currentConversation?.sender.uuid === userUuid
            ? currentConversation.receiver.username
            : currentConversation.sender.username
        }
        companyName={
          currentConversation?.sender.uuid === userUuid
            ? currentConversation.receiver.companyName
            : currentConversation.sender.companyName
        }
        jobTitle={
          currentConversation?.sender.uuid === userUuid
            ? currentConversation.receiver.jobTitle
            : currentConversation.sender.jobTitle
        }
      />
      {currentConversation.receiver.uuid === userUuid &&
        !currentConversation.isReceiverAccepted && (
          <AcceptConversationForm conversationUuid={conversation} />
        )}

      <MessageList
        conversationUuid={conversation}
        lastMessage={{
          body: currentConversation.lastMessage?.body,
          sentByUser:
            currentConversation.lastMessage?.createdByUuid === userUuid,
          createdAt: currentConversation.lastMessage?.createdAt,
        }}
      />
      <SendMessageForm
        conversationUuid={conversation}
        type={
          currentConversation.sender.uuid === userUuid ? "sender" : "receiver"
        }
        isReceiverAccepted={currentConversation.isReceiverAccepted}
      />
    </div>
  )
}

export default ChatRightSection
