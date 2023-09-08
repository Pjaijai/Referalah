import { useMemo } from "react"

import { IProvinceResponse } from "@/types/api/response/province"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useProvinceOptions = (
  provinceList: IProvinceResponse[],
  countryUuid?: string
) => {
  const provinceOptions = useMemo(() => {
    const res: (ISelectOption | undefined)[] = provinceList.map((province) => {
      if (province.country_uuid === countryUuid) {
        return {
          value: province.uuid,
          title: `${province.english_name} | ${province.cantonese_name}`,
        }
      }
      return undefined
    })
    const filtered = res.filter((r) => r !== undefined)
    return filtered as ISelectOption[]
  }, [countryUuid, provinceList])

  return provinceOptions
}

export default useProvinceOptions
