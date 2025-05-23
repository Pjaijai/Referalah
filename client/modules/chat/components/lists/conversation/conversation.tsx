import React, { useEffect } from "react"
import ConversationCard from "@/modules/chat/components/cards/conversation/conversation"
import ConversationListSkeleton from "@/modules/chat/components/skeleton-lists/conversation"
import useConversationStore, {
  IConversation,
} from "@/modules/chat/state/conversations"
import { useI18n } from "@/utils/services/internationalization/client"

import { cn } from "@/lib/utils"
import useGetConversationListByUserUuid from "@/hooks/api/message/get-conversation-by-user-uuid"
import useUserStore from "@/hooks/state/user/store"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import { Icons } from "@/components/icons"

const ConversationList = () => {
  const t = useI18n()
  const userUuid = useUserStore((state) => state.uuid)
  const { data, isLoading, fetchNextPage } =
    useGetConversationListByUserUuid(userUuid)
  const setConversations = useConversationStore(
    (state) => state.setConversations
  )

  const list = data !== undefined ? data.pages.flatMap((d) => d) : []

  useEffect(() => {
    const conversations: IConversation[] = list.map((con) => {
      const {
        last_message_uuid,
        receiver_uuid,
        sender_uuid,
        is_receiver_accepted,
      } = con
      const uuid = con.uuid
      const lastMessage = last_message_uuid
        ? {
            body: last_message_uuid.body,
            createdByUuid: last_message_uuid.sender_uuid,
            createdAt: last_message_uuid.created_at,
            isDocumentExpired: last_message_uuid.is_document_expired,
          }
        : null

      const isReceiverAccepted = is_receiver_accepted

      const receiver = {
        uuid: receiver_uuid.uuid,
        avatarUrl: receiver_uuid.avatar_url,
        companyName: receiver_uuid.company_name,
        jobTitle: receiver_uuid.job_title,
        username: con.receiver_uuid.username,
      }

      const sender = {
        uuid: sender_uuid.uuid,
        avatarUrl: sender_uuid.avatar_url,
        companyName: sender_uuid.company_name,
        jobTitle: sender_uuid.job_title,
        username: con.sender_uuid.username,
      }

      return { uuid, lastMessage, receiver, sender, isReceiverAccepted }
    })

    setConversations(conversations)
  }, [list])

  return (
    <div
      className="flex h-full w-full flex-col gap-2 overflow-y-auto p-2"
      id="conversationScrollDiv"
    >
      {isLoading && <ConversationListSkeleton />}
      {!isLoading && list.length === 0 && (
        <div
          className={cn(
            "w-ful l flex h-full items-center justify-center  p-4 "
          )}
        >
          <div>
            <Icons.conversation />
            <p className="text-muted-foreground">{t("chat.no_message")}</p>
          </div>
        </div>
      )}
      {!isLoading && list.length > 0 && (
        <BaseInfiniteScroll
          dataLength={list ? list.length : 0} //This is important field to render the next data
          scrollableTarget="conversationScrollDiv"
          next={fetchNextPage}
          hasMore={
            data
              ? data &&
                data.pages &&
                data.pages[data.pages.length - 1].length !== 0
              : true
          }
          loader={<></>}
          endMessage={<></>}
        >
          {list.map((data) => {
            return (
              <ConversationCard
                uuid={data.uuid}
                key={data.uuid}
                acceptRequest={
                  userUuid === data.receiver_uuid.uuid
                    ? data.is_receiver_accepted
                    : true
                }
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
                isSeen={
                  data.sender_uuid.uuid === userUuid
                    ? data.is_sender_seen
                    : data.is_receiver_seen
                }
                updatedAt={
                  data.last_message_uuid && data.last_message_uuid.created_at
                }
                type={
                  data.sender_uuid.uuid === userUuid ? "sender" : "receiver"
                }
                documentName={data.last_message_uuid?.document?.name}
              />
            )
          })}
        </BaseInfiniteScroll>
      )}
    </div>
  )
}

export default ConversationList
