import apiService from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { QueryKeyString } from "@/types/common/query-key-string"

const getPosts = ({ queryKey }: any) => {
  const userUuid = queryKey[1].userUuid
  return apiService.getPostsByUserUuid(userUuid)
}

const useGetPostsByUserUuid = (userUuid: string | null) => {
  return useQuery({
    queryKey: [QueryKeyString.GET_POSTS_BY_USER_UUID, { userUuid }],
    queryFn: getPosts,
    enabled: !!userUuid,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export default useGetPostsByUserUuid
