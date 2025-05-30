import React from "react"
import ViewJobJourneyPageTemplate from "@/modules/job-journey/view/template"
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

interface ViewJobJourneyPageProps {
  params: { uuid: string }
}
export const revalidate = 60 * 60 * 24

export async function generateMetadata({
  params,
}: {
  params: { locale: string; uuid: string }
}) {
  const t = await getI18n()
  const jobJourney = await getJobJourneyByUuidWithSteps(params.uuid)

  const title = `${jobJourney.title} | ${jobJourney.position_title} | ${
    jobJourney.company?.name || jobJourney.company_name
  } | ${t("page.job_journey")}`
  return {
    ...siteConfig.defaultMetaData,
    title: title,
    description: jobJourney.description,
    robots: "index, follow",
    openGraph: {
      ...siteConfig.defaultMetaData.openGraph,
      locale: params.locale,
      url: `${process.env.NEXT_PUBLIC_WEB_URL}${params.locale}/${siteConfig.page.viewJobJourney.href}/${params.uuid}`,
      title: title,
      description: jobJourney.description,
    },
    twitter: {
      ...siteConfig.defaultMetaData.twitter,
      title: title,
      description: jobJourney.description,
    },
  }
}

const ViewJobJourneyPage = async ({ params }: ViewJobJourneyPageProps) => {
  const { uuid } = params

  if (!uuid) {
    return (
      <CommonPageLayout>
        <NotFoundTemplate />
      </CommonPageLayout>
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
      <CommonPageLayout>
        <NotFoundTemplate />
      </CommonPageLayout>
    )
  }

  return (
    <CommonPageLayout>
      <ViewJobJourneyPageTemplate
        jobJourney={jobJourney}
        locationList={locationList}
      />
    </CommonPageLayout>
  )
}

export default ViewJobJourneyPage
