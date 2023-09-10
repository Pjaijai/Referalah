import React, { useMemo } from "react"

import { IIndustryResponse } from "@/types/api/response/industry"

const useIndustryOptions = (industryList: IIndustryResponse[]) => {
  const industryOptions = useMemo(
    () =>
      industryList.map((industry) => {
        return {
          value: industry.uuid,
          title: `${industry.english_name} | ${industry.cantonese_name}`,
        }
      }),
    [industryList]
  )
  return industryOptions
}

export default useIndustryOptions
