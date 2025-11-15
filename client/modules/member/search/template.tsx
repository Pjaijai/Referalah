"use client"

import React from "react"
import UserSearchBar from "@/modules/member/components/bars/search"
import MemberCard from "@/modules/member/components/cards/member/member"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import { ELocale } from "@/types/common/enums/locale"
import { EMessageType } from "@/types/common/message-type"
import { EReferralType } from "@/types/common/referral-type"
import useSearchUser from "@/hooks/api/user/search-user"
import useReferralSortOptions from "@/hooks/common/sort/referral-sort-options"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import DonationCard from "@/components/customized-ui/cards/donation"
import TextInput from "@/components/customized-ui/inputs/text"
import BaseSelect from "@/components/customized-ui/selects/base"
import FilterSheet from "@/components/customized-ui/sheets/filter"
import CardSkeletonList from "@/components/customized-ui/skeletons/card-list"
import { Icons } from "@/components/icons"

interface IMemberSearchPageTemplateProps {
  locationList: TLocationData[]
  industryList: IIndustryResponse[]
}

const MemberSearchPageTemplate: React.FunctionComponent<
  IMemberSearchPageTemplateProps
> = ({ locationList, industryList }) => {
  const t = useI18n()
  const {
    result,
    userType,
    handleUserTypeChange,
    handleSortingChange,
    handleIndustryChange,
    handleReset,
    sorting,
    keywords,
    handleKeywordsChange,
    handleLocationChange,
    location,
    industries,
    experience,
    handleExperienceChange,
  } = useSearchUser({
    locationList,
    industryList,
  })

  const locale = useCurrentLocale()

  const { data, fetchNextPage, isLoading, isFetching } = result

  const list = data !== undefined ? data.pages.flatMap((d) => d) : []
  const { data: sortingOptions } = useReferralSortOptions()

  // 1/2 chance to show donation card (memoized to prevent re-calculation on re-renders)
  const showDonationCard = React.useMemo(() => Math.random() < 1 / 2, [])

  return (
    <div className="flex flex-col gap-4">
      <div className=" flex flex-row gap-4 md:hidden">
        <TextInput
          onChange={handleKeywordsChange}
          value={keywords}
          frontIcon={<Icons.search size={18} className="text-slate-400" />}
          inputClassName="bg-slate-100"
          placeholder={t("search.keywords.placeholder")}
        />
        <FilterSheet
          onIndustryChange={handleIndustryChange}
          locationList={locationList}
          industryList={industryList}
          handleReset={handleReset}
          onLocationChange={handleLocationChange}
          location={location}
          industries={industries}
          onExperienceChange={handleExperienceChange}
          experience={experience}
        />
      </div>

      <div className="flex w-full justify-end md:hidden">
        <div className="flex w-3/4 flex-row items-center justify-end">
          <label className="mr-2 w-2/5 text-end text-sm text-slate-500">
            {t("general.sorting")}
          </label>

          <BaseSelect
            options={sortingOptions}
            onChange={handleSortingChange}
            defaultValue={sortingOptions[0].value}
            value={sorting}
            placeholder={t("general.sorting")}
            triggerClassName="w-3/5 border-0"
          />
        </div>
      </div>

      <UserSearchBar
        keywords={keywords}
        onKeyWordsChange={handleKeywordsChange}
        currentUserTypes={userType}
        onUserTypesChange={handleUserTypeChange}
        onIndustryChange={handleIndustryChange}
        onSortingChange={handleSortingChange}
        currentSorting={sorting}
        type={EMessageType.REFERRAL}
        locationList={locationList}
        industryList={industryList}
        handleReset={handleReset}
        onLocationChange={handleLocationChange}
        location={location}
        industries={industries}
        onExperienceChange={handleExperienceChange}
        experience={experience}
      />

      {!isLoading && !isFetching && list.length === 0 && (
        <div className="mt-8 rounded-lg border-2 p-4 text-center">
          {t("user.search_user.no_data")}
        </div>
      )}

      {isLoading && (
        <CardSkeletonList className="xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      )}

      {!isLoading && list.length > 0 && (
        <BaseInfiniteScroll
          dataLength={list ? list.length : 0}
          next={fetchNextPage}
          hasMore={
            data
              ? data &&
                data.pages &&
                data.pages[data.pages.length - 1].length !== 0
              : true
          }
        >
          <div className="mx-auto grid w-full max-w-sm grid-cols-1 gap-4  md:mt-4 md:max-w-none md:grid-cols-2 lg:grid-cols-3">
            {list.map((user, index) => (
              <React.Fragment
                key={
                  index === 2 && showDonationCard
                    ? `donation-${index}`
                    : user.uuid
                }
              >
                {index === 2 && showDonationCard && (
                  <DonationCard className="max-w-[448px]" />
                )}
                <MemberCard
                  key={user.uuid}
                  requestCount={user.contact_request_count}
                  jobTitle={user.job_title}
                  username={user.username}
                  photoUrl={user.avatar_url}
                  companyName={user.company_name}
                  description={user.description}
                  socialMediaUrl={user.social_media_url}
                  yearOfExperience={user.year_of_experience}
                  uuid={user.uuid}
                  receiverType={EReferralType.REFERRER}
                  location={
                    locale === ELocale.ZH_HK
                      ? user.location?.cantonese_name || null
                      : user.location?.english_name || null
                  }
                  industry={
                    locale === ELocale.ZH_HK
                      ? user.industry?.cantonese_name || null
                      : user.industry?.english_name || null
                  }
                  isReferee={user.is_referee}
                  isReferrer={user.is_referer}
                  links={user.links}
                />
              </React.Fragment>
            ))}
          </div>
        </BaseInfiniteScroll>
      )}
    </div>
  )
}

export default MemberSearchPageTemplate
