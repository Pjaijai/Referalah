"use client"

import React from "react"
import NotificationCard from "@/modules/notification/components/cards/notification/notification"
import useNotification from "@/modules/notification/hooks/notification"
import { useI18n } from "@/utils/services/internationalization/client"

import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import { Icons } from "@/components/icons"

const NotificationTemplate = () => {
  const {
    list,
    isLoading,
    hasNextPage,
    handleAddUnseenNotification,
    delayedFetchNextPage,
  } = useNotification()
  const t = useI18n()
  return (
    <div className="mt-4">
      {!isLoading && list.length === 0 && (
        <p className="flex  h-screen  items-center justify-center  text-lg font-semibold text-slate-500 ">
          {t("notifications.no_notifications")}
        </p>
      )}

      {isLoading && (
        <div className="flex h-screen items-center justify-center ">
          <Icons.loader className="animate-spin text-2xl" />
        </div>
      )}

      {!isLoading && list.length > 0 && (
        <BaseInfiniteScroll
          dataLength={list.length}
          next={() => delayedFetchNextPage()}
          hasMore={hasNextPage!}
          loader={<></>}
          endMessage={<></>}
        >
          {list.map((data) => (
            <NotificationCard
              key={data.id}
              createdAt={data.created_at}
              senderUsername={data.data.sender_username}
              isSeen={data.is_seen}
              conversationUuid={data.data.conversation_uuid}
              messageId={data.id}
              addUnseenNotification={handleAddUnseenNotification}
            />
          ))}
        </BaseInfiniteScroll>
      )}
    </div>
  )
}

export default NotificationTemplate
