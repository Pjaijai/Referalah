import { getPostListByUserUuid } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

const getPosts = ({ queryKey }: any) => {
  const uuid = queryKey[1].userUuid
  return getPostListByUserUuid(uuid)
}

const useGetPostListByUserUuid = (userUuid: string) => {
  return useQuery({
    queryKey: [EQueryKeyString.LIST_POSTS, { userUuid }],
    queryFn: getPosts,
    enabled: !!userUuid,
  })
}

export default useGetPostListByUserUuid
