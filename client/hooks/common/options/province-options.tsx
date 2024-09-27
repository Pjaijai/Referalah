import { useMemo } from "react"

import { IProvinceResponse } from "@/types/api/response/province"
import { ISelectOption } from "@/components/customized-ui/selects/base"

// TODO use label
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
        title: `${province.english_name} | ${province.cantonese_name}`,
      }))

    if (options.length > 0 && showAllOption) {
      options.unshift({ value: "all", title: "All | 全部" })
    }

    return options
  }, [provinceList, countryUuid])
}

export default useProvinceOptions
