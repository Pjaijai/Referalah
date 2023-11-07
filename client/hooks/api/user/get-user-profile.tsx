import { getUserProfile } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { QueryKeyString } from "@/types/common/query-key-string"

const getProfile = ({ queryKey }: any) => {
  const userUuid = queryKey[1].userUuid
  return getUserProfile(userUuid)
}

const useGetUserprofile = (userUuid: string | null) => {
  return useQuery({
    queryKey: [QueryKeyString.USER_PROFILE, { userUuid }],
    queryFn: getProfile,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })
}

export default useGetUserprofile
