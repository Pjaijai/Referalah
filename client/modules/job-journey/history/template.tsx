"use client"

import React, { useState } from "react"
import JobJourneyCard from "@/modules/job-journey/component/job-journey-card/job-journey-card"
import { useI18n } from "@/utils/services/internationalization/client"

import { TLocationData } from "@/types/api/response/location"
import useListJobJourneysByUserUuid from "@/hooks/api/job-journey/list-job-journeys-by-user-uuid"
import useJobJourneySortOptions from "@/hooks/common/sort/job-journey-sort-options"
import BaseSelect from "@/components/customized-ui/selects/base"
import CardSkeletonList from "@/components/customized-ui/skeletons/card-list"

interface IJobJourneyHistoryTemplateProps {
  slug: string
  locationList: TLocationData[]
}

const JobJourneyHistoryTemplate: React.FunctionComponent<
  IJobJourneyHistoryTemplateProps
> = ({ slug, locationList }) => {
  const t = useI18n()

  const jobJourneySortingOptions = useJobJourneySortOptions()
  const [sortValue, setSortValue] = useState(jobJourneySortingOptions[0].value)

  const { data, isLoading } = useListJobJourneysByUserUuid(slug, sortValue)

  const handleSortValueChange = (value: string) => {
    setSortValue(value)
  }

  return (
    <div className="w-full ">
      <div className="flex w-full flex-row items-center justify-end">
        <div className="flex w-full flex-row items-center md:w-1/3">
          <label className="mr-2 w-2/5 text-end text-sm text-slate-500">
            {t("general.sorting")}
          </label>

          <BaseSelect
            options={jobJourneySortingOptions}
            onChange={handleSortValueChange}
            value={sortValue}
            placeholder={t("general.sorting")}
            triggerClassName="w-3/5 border-0"
          />
        </div>
      </div>

      <div className="grid w-full place-items-center">
        {isLoading && (
          <CardSkeletonList className="xs:grid-cols-1 lg:grid-cols-2" />
        )}

        {!isLoading && data && !(data.length > 0) && (
          <div className="mt-8 w-full max-w-md rounded-lg border-2 p-4 text-center">
            {t("general.no_data")}
          </div>
        )}

        {!isLoading && data && (
          <div className="mt-8 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((journey) => (
              <JobJourneyCard
                key={journey.uuid}
                uuid={journey.uuid}
                username={journey.user?.username || ""}
                applicationDate={journey.application_submitted_date}
                companyName={journey.company_name || ""}
                jobTitle={journey.position_title}
                stepStatus={journey.last_step_status}
                stepUpdatedDate={journey.last_step_status_updated_at}
                jobType={journey.job_type}
                jobLevel={journey.job_level}
                location={{
                  uuid: journey.location_uuid || "",
                  english_name:
                    locationList.find(
                      (loc) => loc.uuid === journey.location_uuid
                    )?.english_name || "",
                  cantonese_name:
                    locationList.find(
                      (loc) => loc.uuid === journey.location_uuid
                    )?.cantonese_name || "",
                }}
                fireCount={journey.fire_count || 0}
                description={journey.description}
                title={journey.title}
                locationList={locationList}
                logoUrl={journey.company?.meta_data?.logo_url || undefined}
                createdBy={journey.created_by}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobJourneyHistoryTemplate
