import React from "react"
import NotificationCard from "@/modules/notification/components/cards/notification/notification"
import useNotification from "@/modules/notification/hooks/notification"
import { useI18n } from "@/utils/services/internationalization/client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import BellIconWithDot from "@/components/customized-ui/icons/bell-with-dot"
import { Icons } from "@/components/icons"

const NotificationPopover = () => {
  const t = useI18n()
  const {
    list,
    isLoading,
    hasNextPage,
    handleAddUnseenNotification,
    delayedFetchNextPage,
  } = useNotification(10)

  const hasUnseenMessages = list.some((item) => !item.is_seen)
  return (
    <Popover>
      <PopoverTrigger>
        <BellIconWithDot
          className="hidden  md:block"
          showDot={hasUnseenMessages}
        />
      </PopoverTrigger>
      <PopoverContent className="flex h-96 flex-col p-0">
        <div id="notificationScrollDiv" className="h-full overflow-auto">
          {!isLoading && list.length === 0 && (
            <p className="flex h-full items-center justify-center text-sm font-semibold text-slate-500 ">
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
              scrollableTarget={"notificationScrollDiv"}
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
      </PopoverContent>
    </Popover>
  )
}

export default NotificationPopover
