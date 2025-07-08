import React from "react"
import CreateJobJourneyPageTemplate from "@/modules/job-journey/create/template"
import { getIndustryList, getLocationList } from "@/utils/common/api"

import { siteConfig } from "@/config/site"
import AuthenticatedPageWrapper from "@/components/wrappers/authenticated/authenticated"

export const metadata = siteConfig.page.createJobJourney.metadata

export const revalidate = 60 * 60 * 24

const CreateJobJourneyPage = async () => {
  const industryData = await getIndustryList()
  const locationData = await getLocationList()

  return (
    <AuthenticatedPageWrapper>
      <div className="relative h-full ">
        <CreateJobJourneyPageTemplate
          industryData={industryData}
          locationData={locationData}
        />
      </div>
    </AuthenticatedPageWrapper>
  )
}

export default CreateJobJourneyPage
