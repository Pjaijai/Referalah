import { useMemo } from "react"
import { useCurrentLocale } from "@/utils/services/internationalization/client"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IProvinceResponse } from "@/types/api/response/province"
import { ELocale } from "@/types/common/enums/locale"

const useLocationOptions = (
  countryList: ICountryResponse[],
  provinceList: IProvinceResponse[],
  cityList: ICityResponse[],
  filterValue?: string
) => {
  const locale = useCurrentLocale()

  const getCityLabels = (
    countries: ICountryResponse[],
    provinces: IProvinceResponse[],
    cities: ICityResponse[]
  ): { label: string; value: string; filterLabel: string[] }[] => {
    return cities.map((city) => {
      const province = provinces.find((p) => p.uuid === city.province_uuid)
      const country = countries.find((c) => c.uuid === province?.country_uuid)

      if (!province || !country) {
        return { label: "", value: city.uuid, filterLabel: [] }
      }

      const countryText =
        locale === ELocale.ZH_HK ? country.cantonese_name : country.english_name
      const cityText =
        locale === ELocale.ZH_HK ? city.cantonese_name : city.english_name

      // Filter text includes both languages
      const filterLabels = [
        `${city.cantonese_name}, ${country.cantonese_name}`,
        `${city.english_name}, ${country.english_name}`,
      ]

      return {
        label: `${cityText}, ${countryText}`,
        value: city.uuid,
        filterLabel: filterLabels,
      }
    })
  }

  const cityOptions = useMemo(() => {
    const labels = getCityLabels(countryList, provinceList, cityList)
    if (!filterValue) return labels

    const lowerCaseFilter = filterValue.toLowerCase()
    return labels.filter(({ filterLabel }) =>
      filterLabel.some((label) => label.toLowerCase().includes(lowerCaseFilter))
    )
  }, [countryList, provinceList, cityList, filterValue, locale])

  return cityOptions
}

export default useLocationOptions
