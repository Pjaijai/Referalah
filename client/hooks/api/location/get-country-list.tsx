import { getCountryList } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

// TODO: can be removed ?
const useGetCountryList = () => {
  return useQuery({
    queryKey: [EQueryKeyString.COUNTRY_LIST],
    queryFn: getCountryList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export default useGetCountryList
