import React, { ChangeEvent, useState } from "react"
import { refererSortingOptions } from "@/utils/common/sorting/referer"
import InfiniteScroll from "react-infinite-scroll-component"

import { IRefererResponse } from "@/types/api/response/referer-list"
import useGetIndustryList from "@/hooks/api/industry/useGetIndustryList"
import useGetCityList from "@/hooks/api/location/useGetCityList"
import useGetCountryList from "@/hooks/api/location/useGetCountryList"
import useGetProvinceList from "@/hooks/api/location/useGetProvinceList"
import useGetRefererList from "@/hooks/api/referer/useSearchRefererList"
import useSearchRefererList from "@/hooks/api/referer/useSearchRefererList"
import useDebounce from "@/hooks/common/useDebounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ReferralCard from "@/components/customized-ui/cards/referral"
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
  const [page, setPage] = useState(0)
  const [sorting, setSorting] = useState(refererSortingOptions[0].value)
  const debouncedCompanyName = useDebounce(companyName, 800)

  const filterMeta = {
    companyName: debouncedCompanyName,
    cityUuid,
    countryUuid,
    industryUuid,
    provinceUuid,
    sorting,
    yoeMin,
    yoeMax,
  }

  const {
    data: refererListData,
    isLoading: isRefererListLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useSearchRefererList(sorting, filterMeta)
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

  const list = refererListData
    ? (refererListData?.pages.flatMap((d) => d) as IRefererResponse[])
    : []

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
        currentSorting={sorting}
        currentCityUuid={cityUuid}
        currentCountryUuid={countryUuid}
        currentIndustryUuid={industryUuid}
        currentProvinceUuid={provinceUuid}
        currentYeoMax={yoeMax}
        currentYeoMin={yoeMin}
      />

      {isRefererListLoading && <>isloading</>}
      {!isRefererListLoading && list && (
        <InfiniteScroll
          dataLength={list?.length} //This is important field to render the next data
          next={fetchNextPage}
          hasMore={
            (refererListData &&
              refererListData.pages &&
              refererListData.pages[refererListData.pages.length - 1].length !==
                0)!
          }
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          className="w-full h-full"
        >
          <div className="grid grid-cols-3  ">
            {list.map((referer) => {
              return (
                <ReferralCard
                  jobTitle={referer.job_title}
                  username={referer.username}
                  photoUrl={referer.avatar_url}
                  industryList={industryList}
                  countryList={countryList}
                  provinceList={provinceList}
                  cityList={cityList}
                  provinceUuid={referer.province_uuid}
                  countryUuid={referer.country_uuid}
                  cityUuid={referer.city_uuid}
                  companyName={referer.company_name}
                  description={referer.description}
                  industryUuid={referer.industry_uuid}
                  socialMediaUrl={referer.social_media_url}
                  yearOfExperience={referer.year_of_experience}
                  uuid={referer.uuid}
                  key={referer.uuid}
                />
              )
            })}
          </div>
        </InfiniteScroll>
        // </div>
      )}
    </div>
  )
}

export default RefererPageTemplate
