import apiService from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { QueryKeyString } from "@/types/common/query-key-string"

const useGetPostDetails = (postId: string | null) => {
  return useQuery({
    queryKey: [QueryKeyString.POST_DETAILS, { postId }],
    queryFn: apiService.getPostDetails,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })
}

export default useGetPostDetails
