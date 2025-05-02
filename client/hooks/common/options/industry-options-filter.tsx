import { useMemo } from "react"
import { useCurrentLocale } from "@/utils/services/internationalization/client"

import { IIndustryResponse } from "@/types/api/response/industry"
import { ELocale } from "@/types/common/enums/locale"

// TODO: Rename
const useIndustryFilterOptions = (
  industryList: IIndustryResponse[],
  filterValue?: string
) => {
  const locale = useCurrentLocale()

  const getIndustryLabels = (
    industries: IIndustryResponse[]
  ): { label: string; value: string; filterLabel: string[] }[] => {
    return industries.map((industry) => {
      const text =
        locale === ELocale.ZH_HK
          ? industry.cantonese_name
          : industry.english_name

      // Filter text includes both languages
      const filterLabels = [industry.cantonese_name, industry.english_name]

      return {
        label: text,
        value: industry.uuid,
        filterLabel: filterLabels,
      }
    })
  }

  const industryOptions = useMemo(() => {
    const labels = getIndustryLabels(industryList)
    if (!filterValue) return labels

    const lowerCaseFilter = filterValue.toLowerCase()
    return labels.filter(({ filterLabel }) =>
      filterLabel.some((label) => label.toLowerCase().includes(lowerCaseFilter))
    )
  }, [industryList, filterValue, locale])

  return industryOptions
}

export default useIndustryFilterOptions
