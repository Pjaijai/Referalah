"use client"

import React from "react"
import UserSearchBar from "@/modules/member/components/bars/search"
import UserSearchDrawer from "@/modules/member/components/drawers/search"
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
import ReferralCard from "@/components/customized-ui/cards/referral"
import CardSkeletonList from "@/components/customized-ui/skeletons/card-list"

interface IMemberSearchPageTemplateProps {
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  industryList: IIndustryResponse[]
}

const MemberSearchPageTemplate: React.FunctionComponent<
  IMemberSearchPageTemplateProps
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
    handleUserTypesChange,
    userTypes,
  } = useSearchReferral({
    cityList,
    countryList,
    industryList,
    provinceList,
  })

  const {
    data: userListData,
    isLoading: isRefererListLoading,
    fetchNextPage,
    isFetching,
  } = result
  const locale = useCurrentLocale()
  const list =
    userListData !== undefined ? userListData.pages.flatMap((d) => d) : []

  return (
    <div className="flex flex-col gap-4">
      <UserSearchDrawer
        currentUserTypes={userTypes}
        onUserTypesChange={handleUserTypesChange}
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
      <div className="hidden md:block">
        <UserSearchBar
          currentUserTypes={userTypes}
          onUserTypesChange={handleUserTypesChange}
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
      </div>

      {!isRefererListLoading && !isFetching && list.length === 0 && (
        <div className="mt-8 rounded-lg border-2 p-4 text-center">
          {t("user.search_user.no_data")}
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
            userListData
              ? userListData &&
                userListData.pages &&
                userListData.pages[userListData.pages.length - 1].length !== 0
              : true
          }
        >
          <div className="xs:grid-cols-1 mt-8 grid w-full gap-6 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
            {list.map((user) => {
              return (
                <ReferralCard
                  jobTitle={user.job_title}
                  username={user.username}
                  photoUrl={user.avatar_url}
                  companyName={user.company_name}
                  description={user.description}
                  socialMediaUrl={user.social_media_url}
                  yearOfExperience={user.year_of_experience}
                  uuid={user.uuid}
                  key={user.uuid}
                  receiverType={EReferralType.REFERRER}
                  province={
                    locale === "zh-hk"
                      ? user.province && user.province.cantonese_name
                      : user.province && user.province.english_name
                  }
                  country={
                    locale === "zh-hk"
                      ? user.country && user.country.cantonese_name
                      : user.country && user.country.english_name
                  }
                  city={
                    locale === "zh-hk"
                      ? user.city && user.city.cantonese_name
                      : user.city && user.city.english_name
                  }
                  industry={
                    locale === "zh-hk"
                      ? user.industry && user.industry.cantonese_name
                      : user.industry && user.industry.english_name
                  }
                  isReferee={user.is_referee}
                  isReferrer={user.is_referer}
                />
              )
            })}
          </div>
        </BaseInfiniteScroll>
      )}
    </div>
  )
}

export default MemberSearchPageTemplate
