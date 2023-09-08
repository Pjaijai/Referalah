import React, { ChangeEvent, ChangeEventHandler, useState } from "react"
import { refererSortingOptions } from "@/utils/common/sorting/referer"
import { SlidersHorizontal } from "lucide-react"

import useGetIndustryList from "@/hooks/api/industry/useGetIndustryList"
import useGetCityList from "@/hooks/api/location/useGetCityList"
import useGetCountryList from "@/hooks/api/location/useGetCountryList"
import useGetProvinceList from "@/hooks/api/location/useGetProvinceList"
import useGetRefererList from "@/hooks/api/referer/useGetRefererList"
import useDebounce from "@/hooks/common/useDebounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SearchPopover from "@/components/customized-ui/pop-overs/search"

interface IRefererPageTemplateProps {}
const RefererPageTemplate: React.FunctionComponent<
  IRefererPageTemplateProps
> = () => {
  const [companyName, setCompanyName] = useState("")
  const [provinceUuid, setProvinceUuid] = useState<undefined | string>()
  const [countryUuid, setCountryUuid] = useState<undefined | string>()
  const [cityUuid, setCityUuid] = useState<undefined | string>()
  const [industryUuid, setIndustryUuid] = useState<undefined | string>()
  const [yoeMin, setYoeMin] = useState<undefined | string>()
  const [yoeMax, setYoeMax] = useState<undefined | string>()
  const [sorting, setSorting] = useState(refererSortingOptions[0].value)
  const debouncedCompanyName = useDebounce(companyName, 800)
  const { refererList, isLoading } = useGetRefererList({
    companyName: debouncedCompanyName,
    cityUuid,
    countryUuid,
    industryUuid,
    provinceUuid,
    sorting,
    yoeMin,
    yoeMax,
  })
  const { industry: industryList } = useGetIndustryList()
  const { city: cityList } = useGetCityList()
  const { country: countryList } = useGetCountryList()
  const { province: provinceList } = useGetProvinceList()

  const handleCompanyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value)
  }

  const handleCountryChange = (value: string) => {
    setCountryUuid(value)
  }
  const handleProvinceChange = (value: string) => {
    setProvinceUuid(value)
  }
  const handleCityChange = (value: string) => {
    setCityUuid(value)
  }

  const handleIndustryChange = (value: string) => {
    setIndustryUuid(value)
  }

  const handleSortingChange = (value: string) => {
    setSorting(value)
  }

  const handleYeoMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    setYoeMin(e.target.value)
  }

  const handleYeoMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setYoeMax(e.target.value)
  }
  return (
    <div>
      <Input onChange={handleCompanyChange} placeholder="companyname" />
      <SearchPopover
        countryList={countryList}
        provinceList={provinceList}
        cityList={cityList}
        industryList={industryList}
        provinceUuid={provinceUuid}
        countryUuid={countryUuid}
        onCityChange={handleCityChange}
        onCountryChange={handleCountryChange}
        onProvinceChange={handleProvinceChange}
        onIndustryChange={handleIndustryChange}
        onSortingChange={handleSortingChange}
        onYeoMinChange={handleYeoMinChange}
        onYeoMaxChange={handleYeoMaxChange}
      />

      {isLoading && <>isloading</>}
    </div>
  )
}

export default RefererPageTemplate
