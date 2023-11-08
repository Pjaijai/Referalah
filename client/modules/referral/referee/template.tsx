"use client"

import React from "react"

import { MessageType } from "@/types/common/message-type"
import { ReferralType } from "@/types/common/referral-type"
import useSearchReferral from "@/hooks/api/referral/search-referral"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import ResetButton from "@/components/customized-ui/buttons/reset"
import ReferralCard from "@/components/customized-ui/cards/referral"
import SearchPopover from "@/components/customized-ui/pop-overs/search"
import CardSkeletonList from "@/components/customized-ui/skeletons/card-list"

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
    handleSubmitChange,
    handleKeyPressSubmitChange,
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

  const list =
    refereeListData !== undefined ? refereeListData.pages.flatMap((d) => d) : []
  return (
    <>
      <div className="mt-8 flex h-full w-full flex-col-reverse gap-4 md:flex-row">
        <Input
          onChange={handleCompanyChange}
          onKeyDown={handleKeyPressSubmitChange}
          value={companyName}
          placeholder="公司名稱"
        />
        <Input
          onChange={handleJobTitleChange}
          onKeyDown={handleKeyPressSubmitChange}
          value={jobTitle}
          placeholder="職位/工作名稱"
        />
        <div className="flex flex-row justify-end gap-2">
          <SearchPopover
            provinceUuid={provinceUuid}
            countryUuid={countryUuid}
            onCityChange={handleCityChange}
            onCountryChange={handleCountryChange}
            onProvinceChange={handleProvinceChange}
            onIndustryChange={handleIndustryChange}
            onSortingChange={handleSortingChange}
            onYeoMinChange={handleYoeMinChange}
            onYeoMaxChange={handleYoeMaxChange}
            onSubmitChange={handleSubmitChange}
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
          <Button onClick={handleSubmitChange} className="whitespace-nowrap">
            搜尋
          </Button>
        </div>
      </div>
      {!isRefereeListLoading && !isFetching && list.length === 0 && (
        <div className="mt-8 rounded-lg border-2 p-4 text-center">
          冇資料🥲不如成為受薦人？
        </div>
      )}

      {isRefereeListLoading && (
        <CardSkeletonList className="xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      )}

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
          <div className="xs:grid-cols-1 mt-8 grid w-full gap-6 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
            {list.map((referee) => {
              return (
                <ReferralCard
                  jobTitle={referee.job_title}
                  username={referee.username}
                  photoUrl={referee.avatar_url}
                  province={referee.province && referee.province.cantonese_name}
                  country={referee.country && referee.country.cantonese_name}
                  city={referee.city && referee.city.cantonese_name}
                  companyName={referee.company_name}
                  description={referee.description}
                  industry={referee.industry && referee.industry.cantonese_name}
                  socialMediaUrl={referee.social_media_url}
                  yearOfExperience={referee.year_of_experience}
                  uuid={referee.uuid}
                  key={referee.uuid}
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
