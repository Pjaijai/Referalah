import React from "react"
import ChatRoomCard from "@/modules/chat/components/cards/room/room"

import useGetConversationListByUserUuid from "@/hooks/api/message/get-conversation-by-user-uuid"
import useUserStore from "@/hooks/state/user/store"
import { ScrollArea } from "@/components/ui/scroll-area"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"

const ChatRoomList = () => {
  const userUuid = useUserStore((state) => state.uuid)
  const { data, error, isLoading, fetchNextPage } =
    useGetConversationListByUserUuid(userUuid)

  const list = data !== undefined ? data.pages.flatMap((d) => d) : []

  return (
    <div className="h-full w-full gap-y-2">
      {!isLoading && list.length > 0 && (
        <BaseInfiniteScroll
          dataLength={list ? list.length : 0} //This is important field to render the next data
          next={fetchNextPage}
          hasMore={!!(data && data.pageParams[0])}
          endMessage={<></>}
        >
          <ScrollArea className="h-full">
            {list.map((data) => {
              return (
                <ChatRoomCard
                  uuid={data.uuid}
                  avatarUrl={
                    data.sender_uuid.uuid === userUuid
                      ? data.receiver_uuid.avatar_url
                      : data.sender_uuid.avatar_url
                  }
                  username={
                    data.sender_uuid.uuid === userUuid
                      ? data.receiver_uuid.username
                      : data.sender_uuid.username
                  }
                  text={data.last_message_uuid && data.last_message_uuid.body}
                  unread={
                    data.sender_uuid.uuid === userUuid
                      ? data.is_sender_seen
                      : data.is_receiver_seen
                  }
                  updatedAt={
                    data.last_message_uuid && data.last_message_uuid.created_at
                  }
                />
              )
            })}
          </ScrollArea>
        </BaseInfiniteScroll>
      )}
    </div>
  )
}

export default ChatRoomList
