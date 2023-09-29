import apiService from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { QueryKeyString } from "@/types/common/query-key-string"

const useGetIndustryList = () => {
  return useQuery({
    queryKey: [QueryKeyString.INDUSTRY_LIST],
    queryFn: apiService.getIndustryList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export default useGetIndustryList
