import { useMemo } from "react"

import useGetProvinceList from "@/hooks/api/location/get-province-list"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useProvinceOptions = (countryUuid?: string) => {
  const { data } = useGetProvinceList()

  return useMemo<ISelectOption[]>(() => {
    return Array.isArray(data)
      ? data
          .filter((province) => province.country_uuid === countryUuid)
          .map((province) => ({
            value: province.uuid,
            title: `${province.english_name} | ${province.cantonese_name}`,
          }))
      : []
  }, [countryUuid, data])
}

export default useProvinceOptions
