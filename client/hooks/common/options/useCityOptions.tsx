import { useMemo } from "react"

import { ICityResponse } from "@/types/api/response/city"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useCityOptions = (cityList?: ICityResponse[], provinceUuid?: string) => {
  const cityOptions = useMemo(() => {
    const res: (ISelectOption | undefined)[] = cityList
      ? cityList.map((city) => {
          if (city.province_uuid === provinceUuid) {
            return {
              value: city.uuid,
              title: `${city.english_name} | ${city.cantonese_name}`,
            } as { value: string; title: string }
          }

          return undefined
        })
      : []

    const filteredCityOptions = res.filter((r) => r !== undefined)
    return filteredCityOptions
  }, [cityList, provinceUuid])

  return cityOptions as ISelectOption[]
}

export default useCityOptions
