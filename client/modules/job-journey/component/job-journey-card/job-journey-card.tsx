import React from "react"

import "dayjs/locale/zh-hk"
import { useRouter } from "next/navigation"
import getStepTypeStyle from "@/modules/job-journey/helpers/get-step-type-style"
import useLocationLabel from "@/modules/job-journey/hooks/location-label"
import formatVagueDateHelper from "@/utils/common/helpers/format/vague-date"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import { TLocationData } from "@/types/api/response/location"
import { EJobLevel } from "@/types/common/enums/job-level"
import { EJobType } from "@/types/common/enums/job-type"
import { EStepType } from "@/types/common/enums/step-type"
import { cn } from "@/lib/utils"
import useJobLevelOptions from "@/hooks/common/options/Job-level-options"
import useJobTypeOptions from "@/hooks/common/options/Job-type-options"
import useStepTypeOptions from "@/hooks/common/options/step-type-options"
import useUserStore from "@/hooks/state/user/store"
import FireIcon from "@/components/customized-ui/icons/fire"
// Import the zh-hk locale
import { Icons } from "@/components/icons"

export type TJobJourneyCardProps = {
  username: string
  applicationDate: string
  companyName: string
  jobTitle: string
  stepStatus: EStepType
  stepUpdatedDate: string
  jobType: EJobType
  jobLevel: EJobLevel
  location: Pick<TLocationData, "english_name" | "cantonese_name" | "uuid">
  fireCount: number
  description: string | null
  title: string
  uuid: string
  locationList: TLocationData[]
}

const JobJourneyCard: React.FC<TJobJourneyCardProps> = ({
  username,
  applicationDate,
  companyName,
  jobTitle,
  stepStatus,
  stepUpdatedDate,
  jobType,
  jobLevel,
  location,
  fireCount,
  title,
  description,
  uuid,
  locationList,
}) => {
  const locale = useCurrentLocale()
  const router = useRouter()
  const stepTypeStyle = getStepTypeStyle(stepStatus)
  const t = useI18n()
  const stepTypeOptions = useStepTypeOptions()
  const jobTypeOptions = useJobTypeOptions()
  const jobLevelOptions = useJobLevelOptions()
  const fireRecords = useUserStore((state) => state.fireRecords)
  const fireRecord = fireRecords.find((f) => f.uuid === uuid)
  const isFire = !!fireRecord
  const handleClick = () => {
    router.push(`/job-journey/view/${uuid}`)
  }

  const locationLabel = useLocationLabel({ location, locationList })
  const fire =
    fireRecord && fireRecord.isOptimistic === true ? fireCount + 1 : fireCount
  return (
    <div
      className="max-h-96 max-w-2xl cursor-pointer rounded-lg border border-gray-100 bg-white p-[30px] shadow-md transition-shadow duration-200 hover:shadow-lg"
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`View job journey for ${jobTitle} at ${companyName}`}
    >
      {/* Username and Application Date */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-slate-400">@{username}</p>
        <div className="flex flex-row gap-2">
          <time className="text-xs text-gray-700">
            {formatVagueDateHelper(applicationDate, locale)}
          </time>
        </div>
      </div>

      {/* Company and Job Title */}
      <div className="mb-4 flex flex-row items-center gap-5">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-lg text-gray-400">
          <Icons.buildings />
        </span>

        <div className="flex max-w-[calc(100%-5rem)] flex-col">
          <p className="text-xs font-normal text-gray-700">{companyName}</p>
          <h2 className="text-sm font-bold text-gray-800">{jobTitle}</h2>
        </div>
      </div>

      {/* Title and Description */}
      <div className="mt-[14px]">
        <h3
          className="truncate text-xl font-semibold text-slate-700"
          title={title}
        >
          {title}
        </h3>
        {description && (
          <p className="mt-1 line-clamp-2 h-10  text-sm font-normal text-slate-700">
            {description}
          </p>
        )}
      </div>

      {/* Step Status */}
      <div
        className={cn(
          stepTypeStyle,
          "mb-4 mt-[14px] flex items-center justify-between rounded-2xl  px-[10px] py-[6px] text-sm font-medium "
        )}
      >
        <p className="text-[14px] font-semibold">
          {t("job_journey.general.step")}:{" "}
          {stepTypeOptions.find((o) => o.value === stepStatus)?.label}
        </p>
        <time className="text-[10px] font-medium">
          {t("general.updated_on")}:{" "}
          {formatVagueDateHelper(stepUpdatedDate, locale)}
        </time>
      </div>

      {/* Job Details and Engagement Metrics */}
      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-[10px] text-xs text-slate-700 md:text-sm">
          <span className="shrink-0 rounded-md bg-gray-100 px-3 py-1">
            {jobTypeOptions.find((o) => o.value === jobType)?.label}
          </span>
          <span className=" shrink-0 rounded-md bg-gray-100 p-1 px-3">
            {jobLevelOptions.find((o) => o.value === jobLevel)?.label}
          </span>
          <span className="flex shrink items-center gap-1">
            {locationLabel}
          </span>
        </div>

        <div className="flex items-center gap-2" onClick={handleClick}>
          <FireIcon isFire={isFire} />
          <p
            className={cn(
              "font-normal",
              isFire ? "text-indigo-700" : "text-slate-700"
            )}
          >
            {fire}
          </p>
        </div>
      </div>
    </div>
  )
}

export default JobJourneyCard
