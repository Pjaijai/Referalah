import { getUserCount } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

const useGetUserCount = () => {
  return useQuery({
    queryKey: [EQueryKeyString.COUNT_USER],
    queryFn: getUserCount,
    refetchOnWindowFocus: true,
  })
}

export default useGetUserCount
