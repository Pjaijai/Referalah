import { useMemo } from "react"

import useGetCityList from "@/hooks/api/location/get-city-list"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useCityOptions = (provinceUuid?: string) => {
  const { data } = useGetCityList()

  return useMemo<ISelectOption[]>(() => {
    return Array.isArray(data)
      ? data
          .filter((city) => city.province_uuid === provinceUuid)
          .map((city) => ({
            value: city.uuid,
            title: `${city.english_name} | ${city.cantonese_name}`,
          }))
      : []
  }, [data, provinceUuid])
}

export default useCityOptions
