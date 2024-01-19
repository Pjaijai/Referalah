"use client"

import React from "react"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import { EMessageType } from "@/types/common/message-type"
import { EReferralType } from "@/types/common/referral-type"
import useSearchPost from "@/hooks/api/post/search-post"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import ResetButton from "@/components/customized-ui/buttons/reset"
import ReferralPostCard from "@/components/customized-ui/cards/referral-post"
import SearchPopover from "@/components/customized-ui/pop-overs/search"
import CardSkeletonList from "@/components/customized-ui/skeletons/card-list"

interface IRefererPostPageProps {}

const RefererPostPageTemplate: React.FunctionComponent<
  IRefererPostPageProps
> = () => {
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
    companyName,
    jobTitle,
    provinceUuid,
    cityUuid,
    countryUuid,
    industryUuid,
    maxYearOfExperience,
    minYearOfExperience,
    sorting,
  } = useSearchPost(EReferralType.REFERRER)
  const locale = useCurrentLocale()
  console.log(123123, locale)

  const { data, fetchNextPage, isLoading, isFetching } = result

  const list = data !== undefined ? data.pages.flatMap((d) => d) : []

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
            type={EMessageType.POST}
          />
          <ResetButton onClick={handleReset} />
          <Button onClick={handleSubmitChange} className="whitespace-nowrap">
            {t("general.search")}
          </Button>
        </div>
      </div>

      {!isLoading && !isFetching && list.length === 0 && (
        <div className="mt-8 rounded-lg border-2 p-4 text-center">
          {t("referral.search_referrer.no_data")}
        </div>
      )}

      {isLoading && isFetching && (
        <CardSkeletonList className="xs:grid-cols-1 lg:grid-cols-2" />
      )}

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
          <div className="mt-8 grid w-full grid-cols-1 gap-4 overflow-hidden lg:grid-cols-2">
            {list.map((data) => {
              return (
                <ReferralPostCard
                  jobTitle={data.job_title}
                  username={data.user && data.user.username}
                  photoUrl={data.user && data.user.avatar_url}
                  province={
                    locale === "zh-hk"
                      ? data.province && data.province.cantonese_name
                      : data.province && data.province.english_name
                  }
                  country={
                    locale === "zh-hk"
                      ? data.country && data.country.cantonese_name
                      : data.country && data.country.english_name
                  }
                  city={
                    locale === "zh-hk"
                      ? data.city && data.city.cantonese_name
                      : data.city && data.city.english_name
                  }
                  industry={
                    locale === "zh-hk"
                      ? data.industry && data.industry.cantonese_name
                      : data.industry && data.industry.english_name
                  }
                  companyName={data.company_name}
                  description={data.description}
                  url={data.url}
                  yearOfExperience={data.year_of_experience}
                  uuid={data.uuid}
                  createdBy={data.created_by && data.created_by}
                  key={data.uuid}
                  createdAt={data.created_at && data.created_at.toString()}
                />
              )
            })}
          </div>
        </BaseInfiniteScroll>
      )}
    </div>
  )
}

export default RefererPostPageTemplate
