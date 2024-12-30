import { useMemo } from "react"

import { IProvinceResponse } from "@/types/api/response/province"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useProvinceOptions = (
  provinceList: IProvinceResponse[],
  countryUuid?: string,
  showAllOption?: boolean
) => {
  return useMemo<ISelectOption[]>(() => {
    const options = provinceList
      .filter((province) => province.country_uuid === countryUuid)
      .map((province) => ({
        value: province.uuid,
        label: `${province.english_name} | ${province.cantonese_name}`,
      }))

    if (options.length > 0 && showAllOption) {
      options.unshift({ value: "all", label: "All | 全部" })
    }

    return options
  }, [provinceList, countryUuid])
}

export default useProvinceOptions
