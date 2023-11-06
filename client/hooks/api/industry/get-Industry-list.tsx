import { getIndustryList } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { QueryKeyString } from "@/types/common/query-key-string"

const useGetIndustryList = () => {
  return useQuery({
    queryKey: [QueryKeyString.INDUSTRY_LIST],
    queryFn: getIndustryList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export default useGetIndustryList
