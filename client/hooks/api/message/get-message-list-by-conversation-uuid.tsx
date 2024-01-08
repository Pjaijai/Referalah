import { getMessageListByConversationUuid } from "@/utils/common/api"
import { useInfiniteQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

const getMessages = ({ pageParam = 0, queryKey }: any) => {
  const uuid = queryKey[1].conversationUuid
  const NUMBER_OF_DATE_PER_FETCH = 20

  return getMessageListByConversationUuid({
    conversationUuid: uuid,
    page: pageParam,
    numberOfDataPerPage: NUMBER_OF_DATE_PER_FETCH,
  })
}

const useGetMessageListByConversationUuid = (
  conversationUuid?: string | null
) => {
  return useInfiniteQuery({
    queryKey: [EQueryKeyString.MESSAGE_LIST, { conversationUuid }],
    queryFn: getMessages,
    enabled: !!conversationUuid,
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

export default useGetMessageListByConversationUuid
