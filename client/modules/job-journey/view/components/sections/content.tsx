"use client"

import { useRouter } from "next/navigation"
import CompanyAvatar from "@/modules/job-journey/component/avatar/compnay"
import useLocationLabel from "@/modules/job-journey/hooks/location-label"
import StepsTimeline from "@/modules/job-journey/view/components/time-line/time-line"
import formatVagueDateHelper from "@/utils/common/helpers/format/vague-date"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import { TJobJourneyWithSteps } from "@/types/api/job-journey"
import { TLocationData } from "@/types/api/response/location"
import { siteConfig } from "@/config/site"
import useJobLevelOptions from "@/hooks/common/options/Job-level-options"
import useJobTypeOptions from "@/hooks/common/options/Job-type-options"
import useApplicationSourceOptions from "@/hooks/common/options/application-source-options"
import { Icons } from "@/components/icons"

type IContentSectionProps = {
  jobJourney: TJobJourneyWithSteps
  locationList: TLocationData[]
}
const ContentSection = ({ jobJourney, locationList }: IContentSectionProps) => {
  const t = useI18n()
  const locale = useCurrentLocale()
  const jobTypeOptions = useJobTypeOptions()
  const jobLevelOptions = useJobLevelOptions()
  const sourceOptions = useApplicationSourceOptions()
  const locationLabel = useLocationLabel({
    location: jobJourney.location,
    locationList,
  })
  const router = useRouter()
  const infoList = [
    {
      title: t("general.application_submit_data"),
      content: formatVagueDateHelper(jobJourney.created_at, locale),
      icon: (
        <Icons.calendarCheck
          className="text-slate-700"
          width={20}
          height={20}
        />
      ),
    },
    {
      title: t("general.job_type"),
      content: jobTypeOptions.find((o) => o.value === jobJourney.job_type)
        ?.label,
      icon: (
        <Icons.briefcase className="text-slate-700" width={20} height={20} />
      ),
    },
    {
      title: t("general.location"),
      content: locationLabel,
      icon: (
        <Icons.location className="text-slate-700" width={20} height={20} />
      ),
    },
    {
      title: t("general.job_level"),
      content: jobLevelOptions.find((o) => o.value === jobJourney.job_level)
        ?.label,
      icon: (
        <Icons.barChart className="text-slate-700" width={20} height={20} />
      ),
    },
    {
      title: t("general.job_source"),
      content: sourceOptions.find((o) => o.value === jobJourney.source)?.label,
      icon: <Icons.bell className="text-slate-700" width={20} height={20} />,
    },
  ]
  const companyName = jobJourney.company
    ? jobJourney.company.name
    : jobJourney.company_name

  return (
    <div className="w-full ">
      <div className="flex flex-row items-center gap-7">
        <CompanyAvatar />
        <div className="flex flex-col ">
          <p className="text-base font-normal text-slate-700">{companyName}</p>
          <p className="text-xl font-semibold text-slate-800">
            {jobJourney.position_title}
          </p>
        </div>
      </div>

      <div className="mt-[30px] flex flex-col  gap-y-2 md:grid md:grid-cols-5">
        {infoList.map((data) => (
          <div className="grid max-w-xs grid-cols-3  gap-1 text-xs">
            <div className="flex flex-row items-center justify-start gap-[10px] md:col-span-1">
              <span>{data.icon}</span>
              <span>{data.title}:</span>
            </div>

            <span className="flex flex-row items-center justify-start md:col-span-2">
              {data.content}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 min-h-[100px] whitespace-pre-wrap break-words text-sm font-normal text-slate-700">
        {jobJourney.description}
      </div>
      <div className="mt-3 flex justify-end gap-[10px]">
        <div className="flex flex-row items-center  gap-[10px]">
          <Icons.flame className="scale-x-[-1] invert-0" />
          <p>56</p>
        </div>
      </div>

      <div className="mt-[10px] rounded-md bg-slate-100">
        <StepsTimeline steps={jobJourney.job_journey_step} />
      </div>

      <div className="mt-[10px] text-xs font-normal text-slate-400">
        <p>
          Shared by{" "}
          <span
            className="cursor-pointer"
            onClick={() =>
              router.push(
                `${siteConfig.page.profile.href}/${jobJourney.created_by}`
              )
            }
          >
            @{jobJourney.user.username}
          </span>
        </p>
      </div>
    </div>
  )
}

export default ContentSection
