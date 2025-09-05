import { getCityList } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

// TODO: can be removed ?
const useGetCityList = () => {
  return useQuery({
    queryKey: [EQueryKeyString.CITY_LIST],
    queryFn: getCityList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export default useGetCityList
