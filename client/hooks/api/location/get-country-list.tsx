import apiService from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { QueryKeyString } from "@/types/common/query-key-string"

const useGetCountryList = () => {
  return useQuery({
    queryKey: [QueryKeyString.COUNTRY_LIST],
    queryFn: apiService.getCountryList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export default useGetCountryList
