import { useMemo } from "react"

import { IIndustryResponse } from "@/types/api/response/industry"
import { ISelectOption } from "@/components/customized-ui/selects/base"

const useIndustryOptions = (
  industryList: IIndustryResponse[],
  showAllOption?: boolean
) => {
  return useMemo<ISelectOption[]>(() => {
    const options = industryList.map((industry) => ({
      value: industry.uuid,
      title: `${industry.english_name} | ${industry.cantonese_name}`,
    }))

    if (options.length > 0 && showAllOption) {
      options.unshift({ value: "all", title: "All | 全部" })
    }

    return options
  }, [industryList])
}

export default useIndustryOptions
