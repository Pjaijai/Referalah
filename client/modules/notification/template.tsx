"use client"

import React from "react"
import NotificationInfiniteScroll from "@/modules/notification/components/infinite-scroll/notification"

import useGetNotificationListByUserUuid from "@/hooks/api/notification/get-notification-list-by-user-uuid"
import useUserStore from "@/hooks/state/user/store"

const NotificationPageTemplate = () => {
  const userUuid = useUserStore((state) => state.uuid)
  const { data, isLoading, error, fetchNextPage } =
    useGetNotificationListByUserUuid({
      userUuid,
      isAscending: true,
      numberOfDataPerPage: 20,
    })
  const list = data !== undefined ? data.pages.flatMap((d) => d) : []

  return (
    <div className="full flex  flex-col  p-2">
      {!isLoading && (
        <NotificationInfiniteScroll
          data={list}
          fetchNextPage={fetchNextPage}
          hasMore={
            (data &&
              data.pages &&
              data.pages[data.pages.length - 1].length !== 0) ??
            true
          }
          inverse={false}
          dataLength={list ? list.length : 0}
        />
      )}
    </div>
  )
}

export default NotificationPageTemplate
