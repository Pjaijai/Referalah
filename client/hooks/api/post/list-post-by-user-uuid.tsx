import apiService from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { QueryKeyString } from "@/types/common/query-key-string"

const getPosts = ({ queryKey }: any) => {
  const uuid = queryKey[1].userUuid
  const res = apiService.listPostByUserUuid(uuid)
  return res
}

const useListPostByUserUuid = (userUuid: string) => {
  return useQuery({
    queryKey: [QueryKeyString.LIST_POSTS, { userUuid }],
    queryFn: getPosts,
    enabled: !!userUuid,
  })
}

export default useListPostByUserUuid
