import { useMemo } from "react"

import { ICityResponse } from "@/types/api/response/city"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useCityOptions = (
  cityList: ICityResponse[],
  provinceUuid?: string,
  showAllOption?: boolean
) => {
  return useMemo<ISelectOption[]>(() => {
    const options = cityList
      .filter((city) => city.province_uuid === provinceUuid)
      .map((city) => ({
        value: city.uuid,
        title: `${city.english_name} | ${city.cantonese_name}`,
      }))

    if (options.length > 0 && showAllOption) {
      options.unshift({ value: "all", title: "All | 全部" })
    }
    return options
  }, [cityList, provinceUuid])
}

export default useCityOptions
