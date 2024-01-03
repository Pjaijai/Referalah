import React, { useEffect, useMemo, useState } from "react"
import MessageCard from "@/modules/chat/components/cards/message/message"
import { supabase } from "@/utils/services/supabase/config"

import { IMessageListResponse } from "@/types/api/response/chat/message-list"
import useGetMessageListByConversationUuid from "@/hooks/api/message/get-message-list-by-conversation-uuid"
import useUserStore from "@/hooks/state/user/store"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"

interface IMessageListProps {
  conversationUuid?: string | null
  lastMessage: {
    sentByUser: boolean
    body?: string
    createdAt?: string
  }
}
const MessageList: React.FunctionComponent<IMessageListProps> = ({
  conversationUuid,
  lastMessage,
}) => {
  const { data, isLoading, fetchNextPage, refetch, error } =
    useGetMessageListByConversationUuid(conversationUuid)
  const [messages, setMessages] = useState<IMessageListResponse[]>([])

  const userUuid = useUserStore((state) => state.uuid)

  const list = useMemo(() => {
    return data !== undefined ? data.pages.flatMap((d) => d) : []
  }, [data])

  useEffect(() => {
    setMessages(list)
  }, [list])

  useEffect(() => {
    const channel = supabase
      .channel(`message-${conversationUuid}`)
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "message",
          filter: `conversation_uuid=eq.${conversationUuid}`,
          event: "INSERT",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const msg = {
              body: payload.new.body,
              conversation_uuid: payload.new.conversation_uuid,
              created_at: payload.new.created_at,
              id: payload.new.id,
              sender_uuid: payload.new.sender_uuid,
              status: payload.new.status,
              uuid: payload.new.uuid,
            }
            setMessages((prevMessages) => [msg, ...prevMessages])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div
      className="flex h-full flex-col-reverse overflow-y-auto  overflow-x-hidden p-2"
      id="messageScrollDiv"
    >
      {!isLoading && messages.length > 0 && (
        <BaseInfiniteScroll
          dataLength={messages ? messages.length : 0}
          next={fetchNextPage}
          inverse={true}
          scrollableTarget="messageScrollDiv"
          hasMore={
            (data &&
              data.pages &&
              data.pages[data.pages.length - 1].length !== 0) ??
            true
          }
          endMessage={<></>}
        >
          <div className="flex h-full flex-col-reverse gap-2 overflow-y-auto overflow-x-hidden  p-4">
            {messages.map((data) => {
              return (
                <MessageCard
                  text={data.body}
                  sentByUser={userUuid === data.sender_uuid}
                  key={data.uuid}
                  createdAt={data.created_at}
                />
              )
            })}
          </div>
        </BaseInfiniteScroll>
      )}
      {isLoading && (
        <MessageCard
          text={lastMessage.body || "deleted"}
          sentByUser={lastMessage.sentByUser}
          createdAt={lastMessage.createdAt || ""}
        />
      )}
    </div>
  )
}

export default MessageList
