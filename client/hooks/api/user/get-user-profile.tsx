import { getUserProfile } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

const useGetUserprofile = (userUuid: string | null) => {
  return useQuery({
    queryKey: [EQueryKeyString.USER_PROFILE, { userUuid }],
    queryFn: getUserProfile,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })
}

export default useGetUserprofile
