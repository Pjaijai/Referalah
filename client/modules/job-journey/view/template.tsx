import React from "react"
import ContentSection from "@/modules/job-journey/view/components/sections/content"

import { TJobJourneyWithSteps } from "@/types/api/job-journey"
import { TLocationData } from "@/types/api/response/location"

interface ViewJobJourneyPageTemplateProps {
  jobJourney: TJobJourneyWithSteps
  locationList: TLocationData[]
}

const ViewJobJourneyPageTemplate: React.FC<ViewJobJourneyPageTemplateProps> = ({
  jobJourney,
  locationList,
}) => {
  return (
    <div className="mt-[26px] flex w-full flex-row">
      <ContentSection jobJourney={jobJourney} locationList={locationList} />
    </div>
  )
}

export default ViewJobJourneyPageTemplate
