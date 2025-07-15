import React from "react"
import { useJobJourneyFormContext } from "@/modules/job-journey/create/hooks/forms/form-context"
import ContentSection from "@/modules/job-journey/view/components/sections/content"
import { useI18n } from "@/utils/services/internationalization/client"

import { TLocationData } from "@/types/api/response/location"
import useUserStore from "@/hooks/state/user/store"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface PreviewSectionProps {
  jobJourney: any // Form data type
  locationList: TLocationData[]
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  jobJourney,
  locationList,
}) => {
  const t = useI18n()
  const userName = useUserStore((state) => state.username)
  const { goToStep } = useJobJourneyFormContext()

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
      ? {
          id: jobJourney.company.id,
          name: jobJourney.company.name,
          meta_data: {
            logo_url: jobJourney.company.url ?? null,
          },
        }
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
    <div className="container mb-[72px] flex flex-row ">
      <div style={{ flex: 1 }} className={"container-none pr-0 md:container"}>
        <ContentSection
          jobJourney={mappedJobJourney}
          locationList={locationList}
          aria-label="Preview of job journey"
          isPreviewMode={true}
        />
      </div>

      <div className="flex flex-col gap-64   md:gap-[170px] ">
        <Button
          className="flex flex-row justify-center gap-1 bg-white p-3  text-sm  text-slate-500"
          variant={"outline"}
          onClick={() => goToStep(1)}
        >
          <Icons.pencil size={16} className="text-base" />
          <span className="hidden md:block">{t("general.edit")}</span>
        </Button>
        <Button
          className="flex flex-row justify-center gap-1 bg-white p-3  text-sm  text-slate-500"
          variant={"outline"}
          onClick={() => goToStep(2)}
        >
          <Icons.pencil size={16} className="text-base" />
          <span className="hidden md:block">{t("general.edit")}</span>
        </Button>
      </div>
    </div>
  )
}

export default PreviewSection
