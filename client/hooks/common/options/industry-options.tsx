import { useMemo } from "react"

import useGetIndustryList from "@/hooks/api/industry/get-Industry-list"
import { ISelectOption } from "@/components/customized-ui/selects/base"





const useIndustryOptions = () => {
  const { data } = useGetIndustryList()
  return useMemo<ISelectOption[]>(
    () =>
      Array.isArray(data)
        ? data.map((industry) => ({
            value: industry.uuid,
            title: `${industry.english_name} | ${industry.cantonese_name}`,
          }))
        : [],
    [data]
  )
}

export default useIndustryOptions
