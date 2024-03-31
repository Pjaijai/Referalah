"use client"

import React from "react"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { EMessageType } from "@/types/common/message-type"
import { EReferralType } from "@/types/common/referral-type"
import useSearchReferral from "@/hooks/api/referral/search-referral"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import ResetButton from "@/components/customized-ui/buttons/reset"
import ReferralCard from "@/components/customized-ui/cards/referral"
import SearchPopover from "@/components/customized-ui/pop-overs/search"
import CardSkeletonList from "@/components/customized-ui/skeletons/card-list"

interface IRefereePageTemplateProps {
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  industryList: IIndustryResponse[]
}

const RefereePageTemplate: React.FunctionComponent<
  IRefereePageTemplateProps
> = ({ cityList, countryList, industryList, provinceList }) => {
  const locale = useCurrentLocale()
  const t = useI18n()
  const {
    result,
    handleCompanyChange,
    handleCountryChange,
    handleProvinceChange,
    handleCityChange,
    handleSortingChange,
    handleIndustryChange,
    handleMaxYearOfExperienceChange,
    handleMinYearOfExperienceChange,
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
    maxYearOfExperience,
    minYearOfExperience,
    sorting,
  } = useSearchReferral({
    type: EReferralType.REFEREE,
    cityList,
    countryList,
    industryList,
    provinceList,
  })

  const {
    data: refereeListData,
    isLoading: isRefereeListLoading,
    fetchNextPage,
    isFetching,
  } = result

  const list =
    refereeListData !== undefined ? refereeListData.pages.flatMap((d) => d) : []

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-8 flex h-full w-full flex-col-reverse gap-4 md:flex-row">
        <Input
          onChange={handleCompanyChange}
          onKeyDown={handleKeyPressSubmitChange}
          value={companyName}
          placeholder={t("general.company_name")}
        />
        <Input
          onChange={handleJobTitleChange}
          onKeyDown={handleKeyPressSubmitChange}
          value={jobTitle}
          placeholder={t("general.job_title")}
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
            onMinYearOfExperienceChange={handleMinYearOfExperienceChange}
            onMaxYearOfExperienceChange={handleMaxYearOfExperienceChange}
            onSubmitChange={handleSubmitChange}
            currentSorting={sorting}
            currentCityUuid={cityUuid}
            currentCountryUuid={countryUuid}
            currentIndustryUuid={industryUuid}
            currentProvinceUuid={provinceUuid}
            currentMaxYearOfExperience={maxYearOfExperience}
            currentMinYearOfExperience={minYearOfExperience}
            type={EMessageType.REFERRAL}
            cityList={cityList}
            countryList={countryList}
            industryList={industryList}
            provinceList={provinceList}
          />
          <ResetButton onClick={handleReset} />
          <Button onClick={handleSubmitChange} className="whitespace-nowrap">
            {t("general.search")}
          </Button>
        </div>
      </div>
      {!isRefereeListLoading && !isFetching && list.length === 0 && (
        <div className="mt-8 rounded-lg border-2 p-4 text-center">
          {t("referral.search_referee.no_data")}
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
            refereeListData
              ? refereeListData &&
                refereeListData.pages &&
                refereeListData.pages[refereeListData.pages.length - 1]
                  .length !== 0
              : true
          }
        >
          <div className="xs:grid-cols-1 mt-8 grid w-full gap-6 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
            {list.map((referee) => {
              return (
                <ReferralCard
                  jobTitle={referee.job_title}
                  username={referee.username}
                  photoUrl={referee.avatar_url}
                  companyName={referee.company_name}
                  description={referee.description}
                  socialMediaUrl={referee.social_media_url}
                  yearOfExperience={referee.year_of_experience}
                  uuid={referee.uuid}
                  key={referee.uuid}
                  receiverType={EReferralType.REFEREE}
                  province={
                    locale === "zh-hk"
                      ? referee.province && referee.province.cantonese_name
                      : referee.province && referee.province.english_name
                  }
                  country={
                    locale === "zh-hk"
                      ? referee.country && referee.country.cantonese_name
                      : referee.country && referee.country.english_name
                  }
                  city={
                    locale === "zh-hk"
                      ? referee.city && referee.city.cantonese_name
                      : referee.city && referee.city.english_name
                  }
                  industry={
                    locale === "zh-hk"
                      ? referee.industry && referee.industry.cantonese_name
                      : referee.industry && referee.industry.english_name
                  }
                />
              )
            })}
          </div>
        </BaseInfiniteScroll>
      )}
    </div>
  )
}

export default RefereePageTemplate
