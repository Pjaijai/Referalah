import { useMemo } from "react"

import { ICityResponse } from "@/types/api/response/city"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useCityOptions = (cityList: ICityResponse[], provinceUuid?: string) => {
  return useMemo<ISelectOption[]>(() => {
    return cityList
      .filter((city) => city.province_uuid === provinceUuid)
      .map((city) => ({
        value: city.uuid,
        title: `${city.english_name} | ${city.cantonese_name}`,
      }))
  }, [cityList, provinceUuid])
}

export default useCityOptions
