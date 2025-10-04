"use client"

import React from "react"
import PostSearchBar from "@/modules/post/components/bars/search"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { ELocale } from "@/types/common/enums/locale"
import { EMessageType } from "@/types/common/message-type"
import useSearchPost from "@/hooks/api/post/search-post"
import usePostSortOptions from "@/hooks/common/sort/post-sort-options"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import DonationCard from "@/components/customized-ui/cards/donation"
import PostCard from "@/components/customized-ui/cards/post"
import TextInput from "@/components/customized-ui/inputs/text"
import BaseSelect from "@/components/customized-ui/selects/base"
import FilterSheet from "@/components/customized-ui/sheets/filter"
import CardSkeletonList from "@/components/customized-ui/skeletons/card-list"
import { Icons } from "@/components/icons"

interface IPostSearchPageProps {
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  industryList: IIndustryResponse[]
}

const PostSearchPageTemplate: React.FunctionComponent<IPostSearchPageProps> = ({
  countryList,
  provinceList,
  cityList,
  industryList,
}) => {
  const t = useI18n()

  const {
    result,
    postType,
    handlePostTypesChange,
    handleSortingChange,
    handleIndustryChange,
    handleReset,
    sorting,
    keywords,
    handleKeywordsChange,
    handleLocationChange,
    locations,
    industries,
    experience,
    handleExperienceChange,
  } = useSearchPost({
    cityList,
    industryList,
  })
  const locale = useCurrentLocale()

  const { data, fetchNextPage, isLoading, isFetching } = result

  const list = data !== undefined ? data.pages.flatMap((d) => d) : []
  const { data: postSortingOptions } = usePostSortOptions()

  // 1/2 chance to show donation card (memoized to prevent re-calculation on re-renders)
  const showDonationCard = React.useMemo(() => Math.random() < 1 / 2, [])

  return (
    <div className=" flex flex-col gap-4">
      <div className=" flex flex-row gap-4 md:hidden">
        <TextInput
          onChange={handleKeywordsChange}
          value={keywords}
          frontIcon={<Icons.search size={18} className="text-slate-400" />}
          inputClassName="bg-slate-100 placeholder:text-slate-400"
          placeholder={t("search.keywords.placeholder")}
        />
        <FilterSheet
          onIndustryChange={handleIndustryChange}
          cityList={cityList}
          countryList={countryList}
          industryList={industryList}
          provinceList={provinceList}
          handleReset={handleReset}
          onLocationChange={handleLocationChange}
          locations={locations}
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
            options={postSortingOptions}
            onChange={handleSortingChange}
            defaultValue={postSortingOptions[0].value}
            value={sorting}
            placeholder={t("general.sorting")}
            triggerClassName="w-3/5"
          />
        </div>
      </div>

      <div>
        <PostSearchBar
          keywords={keywords}
          onKeyWordsChange={handleKeywordsChange}
          currentPostType={postType}
          onPostTypesChange={handlePostTypesChange}
          onIndustryChange={handleIndustryChange}
          onSortingChange={handleSortingChange}
          currentSorting={sorting}
          type={EMessageType.POST}
          cityList={cityList}
          countryList={countryList}
          industryList={industryList}
          provinceList={provinceList}
          handleReset={handleReset}
          onLocationChange={handleLocationChange}
          locations={locations}
          industries={industries}
          onExperienceChange={handleExperienceChange}
          experience={experience}
        />
      </div>

      {!isLoading && !isFetching && list.length === 0 && (
        <div className="mt-8 rounded-lg border-2 p-4 text-center">
          {t("post.search_post.no_data")}
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
            data
              ? data &&
                data.pages &&
                data.pages[data.pages.length - 1].length !== 0
              : true
          }
        >
          <div className="mx-auto grid w-full max-w-sm grid-cols-1 gap-11 md:mt-4 md:max-w-none md:grid-cols-2 lg:grid-cols-3">
            {list.map((data, index) => (
              <React.Fragment
                key={
                  index === 2 && showDonationCard
                    ? `donation-${index}`
                    : data.uuid
                }
              >
                {index === 2 && showDonationCard && <DonationCard />}
                <PostCard
                  type={data.type}
                  jobTitle={data.job_title}
                  username={data.user && data.user.username}
                  photoUrl={data.user && data.user.avatar_url}
                  province={
                    locale === ELocale.ZH_HK
                      ? data.province && data.province.cantonese_name
                      : data.province && data.province.english_name
                  }
                  country={
                    locale === ELocale.ZH_HK
                      ? data.country && data.country.cantonese_name
                      : data.country && data.country.english_name
                  }
                  city={
                    locale === ELocale.ZH_HK
                      ? data.city && data.city.cantonese_name
                      : data.city && data.city.english_name
                  }
                  industry={
                    locale === ELocale.ZH_HK
                      ? data.industry && data.industry.cantonese_name
                      : data.industry && data.industry.english_name
                  }
                  companyName={data.company_name}
                  url={data.url}
                  yearOfExperience={data.year_of_experience}
                  uuid={data.uuid}
                  createdBy={data.created_by && data.created_by}
                  createdAt={data.created_at && data.created_at.toString()}
                  requestCount={data.contact_request_count}
                />
              </React.Fragment>
            ))}
          </div>
        </BaseInfiniteScroll>
      )}
    </div>
  )
}

export default PostSearchPageTemplate
