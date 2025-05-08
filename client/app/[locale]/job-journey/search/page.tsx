import React from "react"
import SearchJobJourneyPageTemplate from "@/modules/job-journey/search/template"
import { getIndustryList, getLocationList } from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.searchJobJourney.metadata
export const revalidate = 0

const SearchJobJourneyPage = async () => {
  const locationList = await getLocationList()
  const industryList = await getIndustryList()
  const t = await getI18n()
  return (
    <CommonPageLayout title={t("page.job_journey")}>
      <SearchJobJourneyPageTemplate
        locationList={locationList}
        industryList={industryList}
      />
    </CommonPageLayout>
  )
}

export default SearchJobJourneyPage
