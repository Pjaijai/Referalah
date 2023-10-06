"use client"

import React from "react"

import { ISearchPostResponse } from "@/types/api/response/referer-post"
import { MessageType } from "@/types/common/message-type"
import { ReferralType } from "@/types/common/referral-type"
import useGetIndustryList from "@/hooks/api/industry/get-Industry-list"
import useGetCityList from "@/hooks/api/location/get-city-list"
import useGetCountryList from "@/hooks/api/location/get-country-list"
import useGetProvinceList from "@/hooks/api/location/get-province-list"
import useSearchPost from "@/hooks/api/post/search-post"
import { Input } from "@/components/ui/input"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import ReferralCard from "@/components/customized-ui/cards/referral"
import SearchPopover from "@/components/customized-ui/pop-overs/search"
import CardSkeletonList from "@/components/customized-ui/skeletons /card-list"

interface IRefererPostPageProps {}
const RefererPostPageTemplate: React.FunctionComponent<
  IRefererPostPageProps
> = () => {
  const { data: industryList } = useGetIndustryList()
  const { data: cityList } = useGetCityList()
  const { data: countryList } = useGetCountryList()
  const { data: provinceList } = useGetProvinceList()

  const {
    result,
    handleCompanyChange,
    handleCountryChange,
    handleProvinceChange,
    handleCityChange,
    handleSortingChange,
    handleIndustryChange,
    handleYeoMinChange,
    handleYeoMaxChange,
    provinceUuid,
    cityUuid,
    countryUuid,
    industryUuid,
    yoeMax,
    yoeMin,
    sorting,
  } = useSearchPost(ReferralType.REFERRER)

  const { data, fetchNextPage, isLoading, isFetching } = result

  const list = data
    ? (data?.pages.flatMap((d) => d) as ISearchPostResponse[])
    : []

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
          type={MessageType.POST}
        />
      </div>

      {!isLoading && !isFetching && list.length === 0 && (
        <div className="p-4 rounded-lg text-center mt-8 border-2">
          冇資料🥲不如開個Post先？？
        </div>
      )}

      {isLoading && isFetching && <CardSkeletonList />}

      {!isLoading && list.length > 0 && (
        <BaseInfiniteScroll
          dataLength={list ? list.length : 0} //This is important field to render the next data
          next={fetchNextPage}
          hasMore={
            (data &&
              data.pages &&
              data.pages[data.pages.length - 1].length !== 0) ??
            true
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4  w-full overflow-hidden mt-8">
            {list.map((data) => {
              return (
                <ReferralCard
                  jobTitle={data.job_title}
                  username={data.user.username}
                  photoUrl={data.user.avatar_url}
                  province={data.province.cantonese_name}
                  country={data.country.cantonese_name}
                  city={data.city.cantonese_name}
                  industry={data.industry.cantonese_name}
                  companyName={data.company_name}
                  description={data.description}
                  socialMediaUrl={data.url}
                  yearOfExperience={data.year_of_experience}
                  uuid={data.uuid}
                  key={data.uuid}
                  messageType={MessageType.POST}
                  postUuid={data.uuid}
                  toUuid={data.uuid}
                  receiverType={ReferralType.REFERRER}
                  createdAt={data.created_at.toString()}
                />
              )
            })}
          </div>
        </BaseInfiniteScroll>
      )}
    </>
  )
}

export default RefererPostPageTemplate
