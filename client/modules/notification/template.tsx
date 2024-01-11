"use client"

import React from "react"
import NotificationInfiniteScroll from "@/modules/notification/components/infinite-scroll/notification"
import { useQueryClient } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"
import useBulkUpdateNotifications from "@/hooks/api/notification/bulk-update-notificaiotn"
import useGetNotificationListByUserUuid from "@/hooks/api/notification/get-notification-list-by-user-uuid"
import useUserStore from "@/hooks/state/user/store"
import { Button } from "@/components/ui/button"

const NotificationPageTemplate = () => {
  const userUuid = useUserStore((state) => state.uuid)
  const { mutate: update } = useBulkUpdateNotifications()
  const queryClient = useQueryClient()
  const { data, isLoading, error, fetchNextPage, refetch } =
    useGetNotificationListByUserUuid({
      userUuid,
      isAscending: true,
      numberOfDataPerPage: 20,
    })
  const list = data !== undefined ? data.pages.flatMap((d) => d) : []

  const handleClick = () => {
    const mappedList = list.map((data) => {
      if (data.is_seen === false) {
        return {
          is_seen: true,
          uuid: data.uuid,
        }
      } else {
        // Make sure to return an object with the expected shape for all cases
        return null
      }
    })
    const filteredList = mappedList.filter(
      (
        d
      ): d is {
        is_seen: boolean
        uuid: string
      } => !!d
    )

    update(filteredList, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [EQueryKeyString.NOTIFICATION_LIST, { userUuid }],
        })
      },
    })
  }
  return (
    <div className="full flex  flex-col  p-2">
      <Button onClick={handleClick}>Read All</Button>
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
