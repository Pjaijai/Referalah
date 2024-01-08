import React from "react"
import { useSearchParams } from "next/navigation"
import AcceptConversationForm from "@/modules/chat/components/forms/accept-conversation/accept-conversation"
import SendMessageForm from "@/modules/chat/components/forms/message/message"
import ConversationHeader from "@/modules/chat/components/header/conversation/conversation"
import MessageList from "@/modules/chat/components/lists/message/message"
import MessageListSkeleton from "@/modules/chat/components/skeleton-lists/message"
import useConversationStore from "@/modules/chat/state/conversations"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useUserStore from "@/hooks/state/user/store"
import BaseAlert from "@/components/customized-ui/alert/base"
import HighlightedLink from "@/components/customized-ui/links/highlighted"

const ChatRightSection = () => {
  const param = useSearchParams()
  const userUuid = useUserStore((state) => state.uuid)
  const conversation = param.get("conversation")
  const conversations = useConversationStore((state) => state.conversations)
  const currentConversation = conversations.find(
    (con) => con.uuid === conversation
  )

  if (!currentConversation || !conversation)
    return (
      <div
        className={cn(
          "flex w-full items-center p-4",
          !!conversation
            ? "flex w-full md:w-[65%]"
            : "hidden md:flex md:w-[65%]"
        )}
      >
        <BaseAlert
          title="免安裝下載Referalah"
          description={
            <p>
              撳
              <HighlightedLink href={siteConfig.page.installation.href}>
                呢度
              </HighlightedLink>
              睇下點下載，又可以收到即時手機通知！
            </p>
          }
        />
      </div>
    )
  return (
    <div
      className={cn(
        " flex h-full flex-col",
        !!conversation ? "flex w-full md:w-[65%]" : "hidden md:flex md:w-[65%]"
      )}
    >
      <ConversationHeader
        uuid={
          currentConversation?.sender.uuid === userUuid
            ? currentConversation.receiver.uuid
            : currentConversation.sender.uuid
        }
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
