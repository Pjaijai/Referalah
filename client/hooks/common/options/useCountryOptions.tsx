import { useMemo } from "react"

import { ICountryResponse } from "@/types/api/response/country"

const useCountryOptions = (countryList: ICountryResponse[]) => {
  return useMemo(
    () =>
      countryList.map((country) => {
        return {
          value: country.uuid,
          title: `${country.english_name} | ${country.cantonese_name}`,
        }
      }),
    [countryList]
  )
}

export default useCountryOptions
