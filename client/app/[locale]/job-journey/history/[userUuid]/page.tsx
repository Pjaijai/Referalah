import React from "react"
import JobJourneyHistoryTemplate from "@/modules/job-journey/history/template"
import { getLocationList, getUserProfile } from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import CommonPageLayout from "@/components/layouts/common"

export async function generateMetadata({
  params,
}: {
  params: { userUuid: string }
}) {
  const { userUuid } = params
  const t = await getI18n()

  try {
    const res = await getUserProfile(userUuid)
    return {
      title: `${res.username} | ${t("page.job_journey_history")}`,
    }
  } catch (e) {
    return {
      title: t("page.job_journey_history"),
      description: "求職歷程記錄",
      robots: "noindex, nofollow",
    }
  }
}

const JobJourneyHistoryPage = async ({
  params,
}: {
  params: { userUuid: string }
}) => {
  const t = await getI18n()
  const locationList = await getLocationList()

  return (
    <CommonPageLayout title={t("page.job_journey_history")}>
      <JobJourneyHistoryTemplate
        slug={params.userUuid}
        locationList={locationList}
      />
    </CommonPageLayout>
  )
}

export default JobJourneyHistoryPage
