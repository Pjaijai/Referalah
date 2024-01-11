import React from "react"
import NotificationCard from "@/modules/notification/components/cards/notification"

import { INotificationListResponse } from "@/types/api/response/notification/notification-list"
import { cn } from "@/lib/utils"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"

export interface INotificationInfiniteScrollProps {
  fetchNextPage: () => void
  data: INotificationListResponse[]
  hasMore: boolean
  dataLength: number
  inverse: boolean
  scrollableTarget?: string
}
const NotificationInfiniteScroll: React.FunctionComponent<
  INotificationInfiniteScrollProps
> = ({
  fetchNextPage,
  data,
  hasMore,
  dataLength,
  inverse,
  scrollableTarget,
}) => {
  return (
    <BaseInfiniteScroll
      dataLength={dataLength}
      scrollableTarget={scrollableTarget}
      next={fetchNextPage}
      inverse={inverse}
      hasMore={hasMore}
      endMessage={<></>}
      className={cn("flex", inverse ? "flex-col-reverse" : "flex-col")}
    >
      {data.map((data) => {
        return (
          <NotificationCard
            body={data.body}
            createdAt={data.created_at}
            isSeen={data.is_seen}
            key={data.uuid}
          />
        )
      })}
    </BaseInfiniteScroll>
  )
}

export default NotificationInfiniteScroll
