import { ListPostByUserUuid } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

const getPosts = ({ queryKey }: any) => {
  const uuid = queryKey[1].userUuid
  const sortValue = queryKey[1].sortValue
  return ListPostByUserUuid(uuid, sortValue)
}

const useListPostsByUserUuid = (userUuid: string, sortValue: string) => {
  return useQuery({
    queryKey: [EQueryKeyString.LIST_POSTS, { userUuid, sortValue }],
    queryFn: getPosts,
    enabled: !!userUuid,
  })
}

export default useListPostsByUserUuid
