import apiService from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { QueryKeyString } from "@/types/common/query-key-string"

const useGetUserCount = () => {
  return useQuery({
    queryKey: [QueryKeyString.COUNT_USER],
    queryFn: apiService.getUserCount,
    refetchOnWindowFocus: true,
  })
}

export default useGetUserCount
