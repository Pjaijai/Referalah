import { useMemo } from "react"

import { ICountryResponse } from "@/types/api/response/country"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useCountryOptions = (countryList: ICountryResponse[]) => {
  return useMemo<ISelectOption[]>(() => {
    return countryList.map((country) => ({
      value: country.uuid,
      title: `${country.english_name} | ${country.cantonese_name}`,
    }))
  }, [countryList])
}

export default useCountryOptions
