import React from "react"
import UpdateJobJourneyPageTemplate from "@/modules/job-journey/update/template"
import NotFoundTemplate from "@/modules/not-found/template"
import {
  getJobJourneyByUuidWithSteps,
  getLocationList,
} from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import { TJobJourneyWithSteps } from "@/types/api/job-journey"
import { TLocationData } from "@/types/api/response/location"
import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"
import AuthenticatedPageWrapper from "@/components/wrappers/authenticated/authenticated"

interface UpdateJobJourneyPageProps {
  params: { uuid: string }
}
export const metadata = siteConfig.page.updateJobJourney.metadata

export const revalidate = 0

const UpdateJobJourneyPage = async ({ params }: UpdateJobJourneyPageProps) => {
  const { uuid } = params
  const t = await getI18n()

  if (!uuid) {
    return (
      <AuthenticatedPageWrapper>
        <CommonPageLayout>
          <NotFoundTemplate />
        </CommonPageLayout>
      </AuthenticatedPageWrapper>
    )
  }

  let jobJourney: TJobJourneyWithSteps | null = null
  let locationList: TLocationData[] | null = null
  let error: string | null = null

  try {
    jobJourney = await getJobJourneyByUuidWithSteps(uuid)
    locationList = await getLocationList()
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch job journey"
  }

  if (error || !jobJourney || !locationList) {
    return (
      <AuthenticatedPageWrapper>
        <CommonPageLayout>
          <NotFoundTemplate />
        </CommonPageLayout>
      </AuthenticatedPageWrapper>
    )
  }

  return (
    <AuthenticatedPageWrapper>
      <CommonPageLayout title={t("page.update_job_journey")}>
        <UpdateJobJourneyPageTemplate
          jobJourney={jobJourney}
          locationData={locationList}
        />
      </CommonPageLayout>
    </AuthenticatedPageWrapper>
  )
}

export default UpdateJobJourneyPage
