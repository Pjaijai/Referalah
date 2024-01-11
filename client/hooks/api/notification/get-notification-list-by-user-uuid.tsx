import { getNotificationListByUserUuid } from "@/utils/common/api"
import { useInfiniteQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

const getNotificationList = ({ pageParam = 0, queryKey }: any) => {
  const uuid = queryKey[1].userUuid
  const numberOfDataPerPage = queryKey[1].numberOfDataPerPage
  const NUMBER_OF_DATE_PER_FETCH = numberOfDataPerPage || 5
  const isAscending = queryKey[1].isAscending
  return getNotificationListByUserUuid({
    userUuid: uuid,
    page: pageParam,
    numberOfDataPerPage: NUMBER_OF_DATE_PER_FETCH,
    isAscending,
  })
}

const useGetNotificationListByUserUuid = ({
  userUuid,
  isAscending,
  numberOfDataPerPage,
}: {
  userUuid: string | null
  isAscending?: boolean
  numberOfDataPerPage?: number
}) => {
  return useInfiniteQuery({
    queryKey: [
      EQueryKeyString.NOTIFICATION_LIST,
      { userUuid, isAscending, numberOfDataPerPage },
    ],
    queryFn: getNotificationList,
    enabled: !!userUuid,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      if (Array.isArray(lastPage)) {
        return allPages.length
      } else {
        return null
      }
    },
  })
}

export default useGetNotificationListByUserUuid
