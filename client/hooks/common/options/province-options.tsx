import { useMemo } from "react"

import { IProvinceResponse } from "@/types/api/response/province"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useProvinceOptions = (
  provinceList: IProvinceResponse[],
  countryUuid?: string
) => {
  return useMemo<ISelectOption[]>(() => {
    return provinceList
      .filter((province) => province.country_uuid === countryUuid)
      .map((province) => ({
        value: province.uuid,
        title: `${province.english_name} | ${province.cantonese_name}`,
      }))
  }, [provinceList, countryUuid])
}

export default useProvinceOptions
