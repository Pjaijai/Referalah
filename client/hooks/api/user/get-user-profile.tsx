import { getUserProfile } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { QueryKeyString } from "@/types/common/query-key-string"

const useGetUserprofile = (userUuid: string | null) => {
  return useQuery({
    queryKey: [QueryKeyString.USER_PROFILE, { userUuid }],
    queryFn: () => getUserProfile(userUuid!),
    enabled: !!userUuid,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })
}

export default useGetUserprofile
