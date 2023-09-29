import apiService from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { QueryKeyString } from "@/types/common/query-key-string"

const useGetProvinceList = () => {
  return useQuery({
    queryKey: [QueryKeyString.PROVINCE_LIST],
    queryFn: apiService.getProvinceList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export default useGetProvinceList
