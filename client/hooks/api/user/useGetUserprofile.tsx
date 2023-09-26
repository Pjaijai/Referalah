import apiService from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

const useGetUserprofile = (userUuid: string | null) => {
  return useQuery({
    queryKey: [`user-profile`, { userUuid }],
    queryFn: apiService.getUserProfile,
    refetchOnWindowFocus: false,
  })
}

export default useGetUserprofile
