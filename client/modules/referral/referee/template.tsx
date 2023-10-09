import React from "react"

import { IReferralResponse } from "@/types/api/response/referral"
import { MessageType } from "@/types/common/message-type"
import { ReferralType } from "@/types/common/referral-type"
import useGetIndustryList from "@/hooks/api/industry/get-Industry-list"
import useGetCityList from "@/hooks/api/location/get-city-list"
import useGetCountryList from "@/hooks/api/location/get-country-list"
import useGetProvinceList from "@/hooks/api/location/get-province-list"
import useSearchReferral from "@/hooks/api/referral/search-referral"
import { Input } from "@/components/ui/input"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import ResetButton from "@/components/customized-ui/buttons/reset"
import ReferralCard from "@/components/customized-ui/cards/referral"
import SearchPopover from "@/components/customized-ui/pop-overs/search"
import CardSkeletonList from "@/components/customized-ui/skeletons /card-list"

interface IRefereePageTemplateProps {}
const RefereePageTemplate: React.FunctionComponent<
  IRefereePageTemplateProps
> = () => {
  const {
    result,
    handleCompanyChange,
    handleCountryChange,
    handleProvinceChange,
    handleCityChange,
    handleSortingChange,
    handleIndustryChange,
    handleYoeMinChange,
    handleYoeMaxChange,
    handleJobTitleChange,
    handleReset,
    jobTitle,
    companyName,
    provinceUuid,
    cityUuid,
    countryUuid,
    industryUuid,
    yoeMax,
    yoeMin,
    sorting,
  } = useSearchReferral(ReferralType.REFEREE)

  const {
    data: refereeListData,
    isLoading: isRefereeListLoading,
    fetchNextPage,
    isFetching,
  } = result

  const { data: industryList } = useGetIndustryList()
  const { data: cityList } = useGetCityList()
  const { data: countryList } = useGetCountryList()
  const { data: provinceList } = useGetProvinceList()

  const list = refereeListData
    ? (refereeListData?.pages.flatMap((d) => d) as IReferralResponse[])
    : []
  return (
    <>
      <div className="flex flex-col-reverse md:flex-row mt-8 gap-4 w-full h-full">
        <Input
          onChange={handleCompanyChange}
          value={companyName}
          placeholder="公司名稱"
        />
        <Input
          onChange={handleJobTitleChange}
          value={jobTitle}
          placeholder="職位/工作名稱"
        />
        <div className="flex flex-row justify-end gap-2">
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
            onYeoMinChange={handleYoeMinChange}
            onYeoMaxChange={handleYoeMaxChange}
            currentSorting={sorting}
            currentCityUuid={cityUuid}
            currentCountryUuid={countryUuid}
            currentIndustryUuid={industryUuid}
            currentProvinceUuid={provinceUuid}
            currentYeoMax={yoeMax}
            currentYeoMin={yoeMin}
            type={MessageType.REFERRAL}
          />
          <ResetButton onClick={handleReset} />
        </div>
      </div>
      {!isRefereeListLoading && !isFetching && list.length === 0 && (
        <div className="p-4 rounded-lg text-center mt-8 border-2">
          冇資料🥲不如成為受薦人？
        </div>
      )}

      {isRefereeListLoading && <CardSkeletonList />}

      {!isRefereeListLoading && list.length > 0 && (
        <BaseInfiniteScroll
          dataLength={list ? list.length : 0} //This is important field to render the next data
          next={fetchNextPage}
          hasMore={
            (refereeListData &&
              refereeListData.pages &&
              refereeListData.pages[refereeListData.pages.length - 1].length !==
                0) ??
            true
          }
        >
          <div className="grid grid-cols-1 gap-4  w-full overflow-hidden mt-8">
            {list.map((referee) => {
              return (
                <ReferralCard
                  jobTitle={referee.job_title}
                  username={referee.username}
                  photoUrl={referee.avatar_url}
                  province={referee.province.cantonese_name}
                  country={referee.country.cantonese_name}
                  city={referee.city.cantonese_name}
                  companyName={referee.company_name}
                  description={referee.description}
                  industry={referee.industry.cantonese_name}
                  socialMediaUrl={referee.social_media_url}
                  yearOfExperience={referee.year_of_experience}
                  uuid={referee.uuid}
                  key={referee.uuid}
                  messageType={MessageType.REFERRAL}
                  postUuid={referee.uuid}
                  toUuid={referee.uuid}
                  receiverType={ReferralType.REFEREE}
                />
              )
            })}
          </div>
        </BaseInfiniteScroll>
      )}
    </>
  )
}

export default RefereePageTemplate
