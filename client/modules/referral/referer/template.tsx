import React, { ChangeEvent, useMemo, useState } from "react"
import { referralSortingOptions } from "@/utils/common/sorting/referer"

import { IReferralResponse } from "@/types/api/response/referral"
import { MessageType } from "@/types/common/message-type"
import { ReferralType } from "@/types/common/referral-type"
import useGetIndustryList from "@/hooks/api/industry/get-Industry-list"
import useGetCityList from "@/hooks/api/location/get-city-list"
import useGetCountryList from "@/hooks/api/location/get-country-list"
import useGetProvinceList from "@/hooks/api/location/get-province-list"
import useSearchReferral from "@/hooks/api/referral/search-referral"
import useDebounce from "@/hooks/common/debounce"
import { Input } from "@/components/ui/input"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import ReferralCard from "@/components/customized-ui/cards/referral"
import SearchPopover from "@/components/customized-ui/pop-overs/search"
import CardSkeletonList from "@/components/customized-ui/skeletons /card-list"

interface IRefererPageTemplateProps {}
const RefererPageTemplate: React.FunctionComponent<
  IRefererPageTemplateProps
> = () => {
  const [companyName, setCompanyName] = useState("")
  const [provinceUuid, setProvinceUuid] = useState<undefined | string>()
  const [countryUuid, setCountryUuid] = useState<undefined | string>()
  const [cityUuid, setCityUuid] = useState<undefined | string>()
  const [industryUuid, setIndustryUuid] = useState<undefined | string>()
  const [yoeMin, setYoeMin] = useState<undefined | string>("0")
  const [yoeMax, setYoeMax] = useState<undefined | string>("100")
  const [sorting, setSorting] = useState(referralSortingOptions[0].value)
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
    isFetching,
  } = useSearchReferral(sorting, filterMeta, ReferralType.REFERRER)
  const { data: industryList } = useGetIndustryList()
  const { data: cityList } = useGetCityList()
  const { data: countryList } = useGetCountryList()
  const { data: provinceList } = useGetProvinceList()

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
    const rawValue = e.target.value

    // Parse the input value to an integer
    const integerValue = parseInt(rawValue)

    // Check if the parsed value is a valid integer
    if (!isNaN(integerValue) && integerValue >= 0) {
      // If it's a non-negative integer, set the value as is
      setYoeMin(integerValue.toString())
    } else {
      // If it's negative or not a valid integer, set it to '0'
      setYoeMin("0")
    }
  }

  const handleYeoMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value

    // Parse the input value to an integer
    const integerValue = parseInt(rawValue)

    // Check if the parsed value is a valid integer
    if (!isNaN(integerValue) && integerValue >= 0) {
      // If it's a non-negative integer, set the value as is
      setYoeMax(integerValue.toString())
    } else {
      // If it's negative or not a valid integer, set it to '0'
      setYoeMax("0")
    }
  }

  // To hot fix duplication
  // TODO : Double check from api, remove when it is not necessary
  const list = useMemo(() => {
    if (refererListData && refererListData.pages.length > 0) {
      const uuidSet = new Set()
      const list = refererListData?.pages.flatMap(
        (d) => d
      ) as IReferralResponse[]
      const mappedList = list.map((data) => {
        if (!uuidSet.has(data.uuid)) {
          uuidSet.add(data.uuid)
          return data
        }
      })
      return mappedList.filter((d) => d !== undefined) as IReferralResponse[]
    } else {
      return []
    }
  }, [refererListData, refererListData?.pages])

  return (
    <>
      <div className="flex flex-row mt-8 gap-4 w-full h-full">
        <Input onChange={handleCompanyChange} placeholder="公司名稱" />
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
          type={MessageType.REFERRAL}
        />
      </div>
      {!isRefererListLoading && !isFetching && list.length === 0 && (
        <div className="p-4 rounded-lg text-center mt-8 border-2">
          冇資料🥲不如成為推薦人？
        </div>
      )}

      {isRefererListLoading && <CardSkeletonList />}

      {!isRefererListLoading && list.length > 0 && (
        <BaseInfiniteScroll
          dataLength={list ? list.length : 0} //This is important field to render the next data
          next={fetchNextPage}
          hasMore={
            (refererListData &&
              refererListData.pages &&
              refererListData.pages[refererListData.pages.length - 1].length !==
                0) ??
            true
          }
        >
          <div className="grid grid-cols-1 gap-4  w-full overflow-hidden mt-8">
            {list.map((referer) => {
              return (
                <ReferralCard
                  jobTitle={referer.job_title}
                  username={referer.username}
                  photoUrl={referer.avatar_url}
                  province={referer.province.cantonese_name}
                  country={referer.country.cantonese_name}
                  city={referer.city.cantonese_name}
                  companyName={referer.company_name}
                  description={referer.description}
                  industry={referer.industry.cantonese_name}
                  socialMediaUrl={referer.social_media_url}
                  yearOfExperience={referer.year_of_experience}
                  uuid={referer.uuid}
                  key={referer.uuid}
                  messageType={MessageType.REFERRAL}
                  postUuid={referer.uuid}
                  toUuid={referer.uuid}
                  receiverType={ReferralType.REFERRER}
                />
              )
            })}
          </div>
        </BaseInfiniteScroll>
      )}
    </>
  )
}

export default RefererPageTemplate
