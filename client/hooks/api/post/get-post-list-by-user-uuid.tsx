import { getPostListByUserUuid } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { QueryKeyString } from "@/types/common/query-key-string"

const getPosts = ({ queryKey }: any) => {
  const uuid = queryKey[1].userUuid
  return getPostListByUserUuid(uuid)
}

const useGetPostListByUserUuid = (userUuid: string) => {
  return useQuery({
    queryKey: [QueryKeyString.LIST_POSTS, { userUuid }],
    queryFn: getPosts,
    enabled: !!userUuid,
  })
}

export default useGetPostListByUserUuid
