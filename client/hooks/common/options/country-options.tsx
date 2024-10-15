import { useMemo } from "react"

import { ICountryResponse } from "@/types/api/response/country"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useCountryOptions = (
  countryList: ICountryResponse[],
  showAllOption?: boolean
) => {
  return useMemo<ISelectOption[]>(() => {
    const options = countryList.map((country) => ({
      value: country.uuid,
      label: `${country.english_name} | ${country.cantonese_name}`,
    }))

    if (options.length > 0 && showAllOption) {
      options.unshift({ value: "all", label: "All | 全部" })
    }
    return options
  }, [countryList])
}

export default useCountryOptions
