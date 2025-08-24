import { getProvinceList } from "@/utils/common/api"
import { useQuery } from "@tanstack/react-query"

import { EQueryKeyString } from "@/types/common/query-key-string"

// TODO: can be removed ?
const useGetProvinceList = () => {
  return useQuery({
    queryKey: [EQueryKeyString.PROVINCE_LIST],
    queryFn: getProvinceList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export default useGetProvinceList
