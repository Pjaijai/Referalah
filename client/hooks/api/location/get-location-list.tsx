import { getLocationList } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

const useGetCountryList = () => {
  return useQuery({
    queryKey: [EQueryKeyString.LOCATION_LIST],
    queryFn: getLocationList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export default useGetCountryList
