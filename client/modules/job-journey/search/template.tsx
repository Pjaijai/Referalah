"use client"

import React from "react"
import { useRouter } from "next/navigation"
import JobJourneyCard from "@/modules/job-journey/component/job-journey-card/job-journey-card"
import JobJourneySearchBar from "@/modules/job-journey/search/components/bars/search"
import FilterSheet from "@/modules/job-journey/search/components/sheets/filter"
import { useI18n } from "@/utils/services/internationalization/client"

import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import { siteConfig } from "@/config/site"
import useSearchJourney from "@/hooks/api/job-journey/search-job-journey"
import { Button } from "@/components/ui/button"
import BaseInfiniteScroll from "@/components/customized-ui/Infinite-scroll/base"
import DonationCard from "@/components/customized-ui/cards/donation"
import StepsRedirectCard from "@/components/customized-ui/cards/steps-redirect"
import TextInput from "@/components/customized-ui/inputs/text"
import CardSkeletonList from "@/components/customized-ui/skeletons/card-list"
import { Icons } from "@/components/icons"

interface ISearchJobJourneyPageTemplateProps {
  locationList: TLocationData[]
  industryList: IIndustryResponse[]
}
const SearchJobJourneyPageTemplate: React.FunctionComponent<
  ISearchJobJourneyPageTemplateProps
> = ({ locationList, industryList }) => {
  const t = useI18n()
  const router = useRouter()

  const {
    result,
    handleSortingChange,
    handleIndustryChange,
    handleReset,
    sorting,
    keywords,
    handleKeywordsChange,
    handleLocationChange,
    handleJobLevelChange,
    handleCompanyChange,
    jobLevel,
    company,
    industry,
    location,
  } = useSearchJourney({
    locationList,
    industryList,
  })
  const { data, fetchNextPage, isLoading, isFetching, hasNextPage } = result
  const handleCreateClick = () => {
    router.push(`${siteConfig.page.createJobJourney.href}`)
  }
  const list = data !== undefined ? data.pages.flatMap((d) => d) : []

  // 50% chance to show donation card, 50% chance to show steps redirect card
  const showDonationCard = React.useMemo(() => Math.random() < 1 / 2, [])

  return (
    <div>
      <div className=" flex flex-row gap-4  md:hidden">
        <TextInput
          onChange={handleKeywordsChange}
          value={keywords}
          frontIcon={<Icons.search size={18} className="text-slate-400" />}
          inputClassName="bg-slate-100"
          placeholder={t("search.keywords.placeholder")}
        />

        <FilterSheet
          onJobLevelChange={handleJobLevelChange}
          currentJobLevel={jobLevel}
          locationData={locationList}
          onIndustryChange={handleIndustryChange}
          industryData={industryList}
          currentIndustry={industry}
          currentSorting={sorting}
          onSortingChange={handleSortingChange}
          currentLocation={location}
          onLocationChange={handleLocationChange}
          onReset={handleReset}
          onCompanyChange={handleCompanyChange}
          currentCompany={company}
        />
      </div>
      <JobJourneySearchBar
        onJobLevelChange={handleJobLevelChange}
        onCompanyChange={handleCompanyChange}
        currentJobLevel={jobLevel}
        currentCompany={company}
        keywords={keywords}
        locationData={locationList}
        onIndustryChange={handleIndustryChange}
        industryData={industryList}
        currentIndustry={industry}
        currentSorting={sorting}
        onSortingChange={handleSortingChange}
        currentLocation={location}
        onLocationChange={handleLocationChange}
        onReset={handleReset}
        onKeywordsChange={handleKeywordsChange}
      />
      <div className="mt-8  flex justify-end">
        <Button variant={"theme"} size={"lg"} onClick={handleCreateClick}>
          + {t("page.create_job_journey")}
        </Button>
      </div>
      {!isLoading && !isFetching && list.length === 0 && (
        <div className="mt-8 rounded-lg p-4 text-center">
          {t("general.result_not_found")}
        </div>
      )}
      {isLoading && isFetching && (
        <CardSkeletonList className="xs:grid-cols-1 md:grid-cols-2" />
      )}
      {!isLoading && list.length > 0 && (
        <BaseInfiniteScroll
          dataLength={list ? list.length : 0}
          next={fetchNextPage}
          hasMore={hasNextPage!}
        >
          <div className="mx-auto mt-10 grid w-full max-w-sm grid-cols-1 gap-[30px] md:mt-8 md:max-w-none md:grid-cols-2">
            {list.map((data, index) => {
              // Show card at index 2
              if (index === 2) {
                return showDonationCard ? (
                  <DonationCard
                    key={`donation-${index}`}
                    className="max-w-sm"
                  />
                ) : (
                  <StepsRedirectCard
                    key={`steps-${index}`}
                    className="max-w-sm"
                  />
                )
              }

              return (
                <JobJourneyCard
                  key={data.uuid}
                  applicationDate={data.application_submitted_date}
                  companyName={
                    ((data.company && data.company.name) ||
                      data.company_name) as string
                  }
                  description={data.description}
                  title={data.title}
                  fireCount={data.fire_count}
                  jobLevel={data.job_level}
                  stepStatus={data.last_step_status}
                  stepUpdatedDate={data.last_step_status_updated_at}
                  jobTitle={data.position_title}
                  jobType={data.job_type}
                  username={data.user.username}
                  uuid={data.uuid}
                  location={data.location}
                  locationList={locationList}
                  logoUrl={data.company?.meta_data?.logo_url ?? undefined}
                />
              )
            })}
          </div>
        </BaseInfiniteScroll>
      )}
    </div>
  )
}

export default SearchJobJourneyPageTemplate
