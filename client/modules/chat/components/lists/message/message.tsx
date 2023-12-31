import React from "react"
import MessageCard from "@/modules/chat/components/cards/message/message"

import useGetMessageListByConversationUuid from "@/hooks/api/message/get-message-list-by-conversation-uuid"
import useUserStore from "@/hooks/state/user/store"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"

interface IMessageListProps {
  conversationUuid?: string | null
}
const MessageList: React.FunctionComponent<IMessageListProps> = ({
  conversationUuid,
}) => {
  const { data, isLoading, fetchNextPage, error } =
    useGetMessageListByConversationUuid(conversationUuid)
  const userUuid = useUserStore((state) => state.uuid)
  const list = data !== undefined ? data.pages.flatMap((d) => d) : []

  return (
    <div className="h-full w-full">
      {!isLoading && list.length > 0 && (
        <BaseInfiniteScroll
          dataLength={list ? list.length : 0} //This is important field to render the next data
          next={fetchNextPage}
          hasMore={!!(data && data.pageParams[0])}
          endMessage={<></>}
        >
          <div className="flex h-full flex-col gap-2">
            {list.map((data) => {
              return (
                <MessageCard
                  text={data.body}
                  sentByUser={userUuid === data.sender_uuid}
                  key={data.uuid}
                />
              )
            })}
          </div>
        </BaseInfiniteScroll>
      )}
    </div>
  )
}

export default MessageList
