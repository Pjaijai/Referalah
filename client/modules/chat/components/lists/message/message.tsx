import React from "react"
import MessageCard from "@/modules/chat/components/cards/message/message"

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
  const { data, isLoading, fetchNextPage, error } =
    useGetMessageListByConversationUuid(conversationUuid)

  const userUuid = useUserStore((state) => state.uuid)
  const list = data !== undefined ? data.pages.flatMap((d) => d) : []

  return (
    <div className="h-full w-full flex-1 overflow-auto ">
      {!isLoading && list.length > 0 && (
        <BaseInfiniteScroll
          dataLength={list ? list.length : 0} //This is important field to render the next data
          next={fetchNextPage}
          hasMore={
            (data &&
              data.pages &&
              data.pages[data.pages.length - 1].length !== 0) ??
            true
          }
          endMessage={<></>}
        >
          <div className="flex h-full flex-col gap-2 p-4">
            {list.map((data) => {
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
