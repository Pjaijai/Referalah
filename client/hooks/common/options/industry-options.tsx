import { useMemo } from "react"

import { IIndustryResponse } from "@/types/api/response/industry"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useIndustryOptions = (industryList: IIndustryResponse[]) => {
  return useMemo<ISelectOption[]>(
    () =>
      industryList.map((industry) => ({
        value: industry.uuid,
        title: `${industry.english_name} | ${industry.cantonese_name}`,
      })),
    [industryList]
  )
}

export default useIndustryOptions
