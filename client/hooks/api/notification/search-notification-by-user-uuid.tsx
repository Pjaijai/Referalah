import { searchNotificationByUserUuid } from "@/utils/common/api"
import { useInfiniteQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

const useSearchNotificationByUserUuid = (
  userUuid: string | null,
  numberOfDataPerPage: number = 6
) => {
  return useInfiniteQuery(
    [EQueryKeyString.SEARCH_NOTIFICATION, { userUuid }],
    async ({ pageParam = 0 }) => {
      const result = await searchNotificationByUserUuid({
        numberOfDataPerPage: numberOfDataPerPage,
        page: pageParam,
        userUuid,
      })
      return result
    },
    {
      enabled: !!userUuid,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, allPages) => {
        if (Array.isArray(lastPage) && lastPage.length > 0) {
          return allPages.length
        } else {
          return undefined
        }
      },
    }
  )
}

export default useSearchNotificationByUserUuid
