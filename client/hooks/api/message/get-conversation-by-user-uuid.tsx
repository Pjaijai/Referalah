import { getConversationListByUserUuid } from "@/utils/common/api"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

const getConversations = ({ pageParam = 0, queryKey }: any) => {
  const uuid = queryKey[1].userUuid
  const NUMBER_OF_DATE_PER_FETCH = 5

  return getConversationListByUserUuid({
    userUuid: uuid,
    page: pageParam,
    numberOfDataPerPage: NUMBER_OF_DATE_PER_FETCH,
  })
}

const useGetConversationListByUserUuid = (userUuid: string | null) => {
  return useInfiniteQuery({
    queryKey: [EQueryKeyString.CONVERSATION_LIST, { userUuid }],
    queryFn: getConversations,
    enabled: !!userUuid,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
    getNextPageParam: (lastPage, allPages) => {
      if (Array.isArray(lastPage)) {
        return allPages.length
      } else {
        return null
      }
    },
  })
}

export default useGetConversationListByUserUuid
