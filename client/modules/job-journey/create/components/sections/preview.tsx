import React from "react"
import ContentSection from "@/modules/job-journey/view/components/sections/content"

import { TLocationData } from "@/types/api/response/location"
import useUserStore from "@/hooks/state/user/store"
import CommonPageLayout from "@/components/layouts/common"

interface PreviewSectionProps {
  jobJourney: any // Form data type
  locationList: TLocationData[]
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  jobJourney,
  locationList,
}) => {
  const userName = useUserStore((state) => state.username)
  // jobJourney here is the form data, not the API type, but ContentSection expects TJobJourneyWithSteps
  // Map form data to the expected structure as much as possible
  const mappedJobJourney = {
    ...jobJourney,
    uuid: "preview-mode",
    fire_count: 0,
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
    company: jobJourney.company
      ? { id: jobJourney.company.id, name: jobJourney.company.name }
      : { name: jobJourney.newCompany },
    user: {
      username: userName,
    },
    application_submitted_date: jobJourney.applicationDate
      ? typeof jobJourney.applicationDate === "string"
        ? jobJourney.applicationDate
        : jobJourney.applicationDate.toISOString()
      : "",
    position_title: jobJourney.positionTitle,
    job_type: jobJourney.jobType,
    job_level: jobJourney.jobLevel,
    source: jobJourney.source,
    description: jobJourney.description,
    title: jobJourney.title,
    location: jobJourney.location,
    // Add other necessary mappings if needed
  }
  return (
    <CommonPageLayout>
      <ContentSection
        jobJourney={mappedJobJourney}
        locationList={locationList}
        aria-label="Preview of job journey"
      />
    </CommonPageLayout>
  )
}

export default PreviewSection
