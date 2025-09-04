import React from "react"
import ContentSection from "@/modules/job-journey/view/components/sections/content"
import { useI18n } from "@/utils/services/internationalization/client"

import { TLocationData } from "@/types/api/response/location"
import useUserStore from "@/hooks/state/user/store"

interface UpdatePreviewSectionProps {
  jobJourney: any // Form data type
  locationList: TLocationData[]
  originalJobJourney: any // Original job journey data for company and other info
}

const UpdatePreviewSection: React.FC<UpdatePreviewSectionProps> = ({
  jobJourney,
  locationList,
  originalJobJourney,
}) => {
  const t = useI18n()
  const userName = useUserStore((state) => state.username)

  const mappedJobJourney = {
    ...originalJobJourney,
    uuid: originalJobJourney.uuid,
    fire_count: originalJobJourney.fire_count || 0,
    job_journey_step: (jobJourney.steps || []).map(
      (step: any, idx: number) => ({
        id: idx + 1,
        position: idx + 1,
        step_date: step.date
          ? typeof step.date === "string"
            ? step.date
            : step.date.toISOString()
          : "",
        step_type: step.type,
        interview_location: step.interviewLocation || null,
        interview_type: step.interviewType || null,
        remarks: step.remarks || "",
      })
    ),
    // Keep original company info
    company: originalJobJourney.company,
    user: {
      username: userName || originalJobJourney.user?.username,
    },
    // Use updated title and description from form
    title: jobJourney.title,
    description: jobJourney.description,
    // Keep other original data
    application_submitted_date: originalJobJourney.application_submitted_date,
    position_title: originalJobJourney.position_title,
    job_type: originalJobJourney.job_type,
    job_level: originalJobJourney.job_level,
    source: originalJobJourney.source,
    location: originalJobJourney.location,
    created_by: originalJobJourney.created_by,
  }

  return (
    <div className="container mb-[72px] flex flex-row">
      <div style={{ flex: 1 }} className={"container-none pr-0 md:container"}>
        <ContentSection
          jobJourney={mappedJobJourney}
          locationList={locationList}
          aria-label="Preview of updated job journey"
          isPreviewMode={true}
        />
      </div>
    </div>
  )
}

export default UpdatePreviewSection
