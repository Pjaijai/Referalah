import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { siteConfig } from "@/config/site"
import useBulkUpdateNotificationsSeen from "@/hooks/api/notification/bulk-update-notifications-seen"
import useSearchNotificationByUserUuid from "@/hooks/api/notification/search-notification-by-user-uuid"
import useUserStore from "@/hooks/state/user/store"

const useNotification = (numberOfDataPerPage?: number) => {
  const { uuid: userUuid } = useUserStore()
  const router = useRouter()
  const { data, fetchNextPage, isLoading, hasNextPage } =
    useSearchNotificationByUserUuid(userUuid, numberOfDataPerPage)

  const [list, setList] = useState(data?.pages.flatMap((d) => d) || [])

  useEffect(() => {
    if (data) {
      setList(data.pages.flatMap((d) => d))
    }
  }, [data])

  const [seenNotificationIds, setSeenNotificationIds] = useState(
    new Set<number>()
  )
  const { mutate: markAsSeen } = useBulkUpdateNotificationsSeen()

  useEffect(() => {
    if (seenNotificationIds.size === 0 || !userUuid) return

    const timer = setTimeout(() => {
      markAsSeen(
        { messageIds: Array.from(seenNotificationIds), userUuid },
        {
          onSuccess(data) {
            setList((prevList) =>
              prevList.map((notification) => {
                const updatedNotification = data.find(
                  (n) => n.id === notification.id
                )
                return updatedNotification ? updatedNotification : notification
              })
            )
          },
        }
      )
      setSeenNotificationIds(new Set())
    }, 2000)

    return () => clearTimeout(timer)
  }, [seenNotificationIds, markAsSeen, userUuid])

  const handleAddUnseenNotification = useCallback(
    (notificationUuid: number, conversationUuid: string) => {
      setSeenNotificationIds((prev) => {
        const newSet = new Set(prev)
        newSet.add(notificationUuid)
        return newSet
      })
      router.push(
        `${siteConfig.page.chat.href}?conversation=${conversationUuid}`
      )
    },
    [router]
  )

  const delayedFetchNextPage = () => {
    setTimeout(() => {
      fetchNextPage()
    }, 500)
  }

  return {
    list,
    isLoading,
    hasNextPage,
    handleAddUnseenNotification,
    delayedFetchNextPage,
  }
}

export default useNotification
