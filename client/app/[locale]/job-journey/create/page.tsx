import React from "react"
import CreateJobJourneyPageTemplate from "@/modules/job-journey/create/template"
import { getIndustryList, getLocationList } from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"
import AuthenticatedPageWrapper from "@/components/wrappers/authenticated/authenticated"

export const metadata = siteConfig.page.createJobJourney.metadata

export const revalidate = 60 * 60 * 24

const CreateJobJourneyPage = async () => {
  const industryData = await getIndustryList()
  const locationData = await getLocationList()
  const t = await getI18n()
  return (
    <AuthenticatedPageWrapper>
      <CommonPageLayout
        title={t("page.create_job_journey")}
        className="max-w-full"
      >
        <CreateJobJourneyPageTemplate
          industryData={industryData}
          locationData={locationData}
        />
      </CommonPageLayout>
    </AuthenticatedPageWrapper>
  )
}

export default CreateJobJourneyPage
