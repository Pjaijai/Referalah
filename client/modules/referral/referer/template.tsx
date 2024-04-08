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
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import SearchBar from "@/components/customized-ui/bars/search"
import ReferralCard from "@/components/customized-ui/cards/referral"
import CardSkeletonList from "@/components/customized-ui/skeletons/card-list"

interface IRefererPageTemplateProps {
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  industryList: IIndustryResponse[]
}

const RefererPageTemplate: React.FunctionComponent<
  IRefererPageTemplateProps
> = ({ cityList, countryList, industryList, provinceList }) => {
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
    handleSubmitChange,
    handleKeyPressSubmitChange,
    handleReset,
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
    type: EReferralType.REFERRER,
    cityList,
    countryList,
    industryList,
    provinceList,
  })

  const {
    data: refererListData,
    isLoading: isRefererListLoading,
    fetchNextPage,
    isFetching,
  } = result
  const locale = useCurrentLocale()
  const list =
    refererListData !== undefined ? refererListData.pages.flatMap((d) => d) : []

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
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
        handleCompanyChange={handleCompanyChange}
        handleKeyPressSubmitChange={handleKeyPressSubmitChange}
        companyName={companyName}
        handleJobTitleChange={handleJobTitleChange}
        handleReset={handleReset}
        jobTitle={jobTitle}
        handleSubmit={handleSubmitChange}
      />

      {!isRefererListLoading && !isFetching && list.length === 0 && (
        <div className="mt-8 rounded-lg border-2 p-4 text-center">
          {t("referral.search_referrer.no_data")}
        </div>
      )}

      {isRefererListLoading && (
        <CardSkeletonList className="xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      )}

      {!isRefererListLoading && list.length > 0 && (
        <BaseInfiniteScroll
          dataLength={list ? list.length : 0} //This is important field to render the next data
          next={fetchNextPage}
          hasMore={
            refererListData
              ? refererListData &&
                refererListData.pages &&
                refererListData.pages[refererListData.pages.length - 1]
                  .length !== 0
              : true
          }
        >
          <div className="xs:grid-cols-1 mt-8 grid w-full gap-6 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
            {list.map((referer) => {
              return (
                <ReferralCard
                  jobTitle={referer.job_title}
                  username={referer.username}
                  photoUrl={referer.avatar_url}
                  companyName={referer.company_name}
                  description={referer.description}
                  socialMediaUrl={referer.social_media_url}
                  yearOfExperience={referer.year_of_experience}
                  uuid={referer.uuid}
                  key={referer.uuid}
                  receiverType={EReferralType.REFERRER}
                  province={
                    locale === "zh-hk"
                      ? referer.province && referer.province.cantonese_name
                      : referer.province && referer.province.english_name
                  }
                  country={
                    locale === "zh-hk"
                      ? referer.country && referer.country.cantonese_name
                      : referer.country && referer.country.english_name
                  }
                  city={
                    locale === "zh-hk"
                      ? referer.city && referer.city.cantonese_name
                      : referer.city && referer.city.english_name
                  }
                  industry={
                    locale === "zh-hk"
                      ? referer.industry && referer.industry.cantonese_name
                      : referer.industry && referer.industry.english_name
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

export default RefererPageTemplate
