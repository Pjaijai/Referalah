import { useMemo } from "react"

import { IIndustryResponse } from "@/types/api/response/industry"
import { ISelectOption } from "@/components/customized-ui/selects/base"

// TODO remove it and replace ISelectOption using label
const useIndustryOptions = (
  industryList: IIndustryResponse[],
  showAllOption?: boolean
) => {
  return useMemo<ISelectOption[]>(() => {
    const options = industryList.map((industry) => ({
      value: industry.uuid,
      label: `${industry.english_name} | ${industry.cantonese_name}`,
    }))

    if (options.length > 0 && showAllOption) {
      options.unshift({ value: "all", label: "All | 全部" })
    }

    return options
  }, [industryList])
}

export default useIndustryOptions
