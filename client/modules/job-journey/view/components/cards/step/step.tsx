import React from "react"
import getStepTypeIcon from "@/modules/job-journey/helpers/get-step-type-icon"
import getStepTypeStyle from "@/modules/job-journey/helpers/get-step-type-style"
import formatVagueDateHelper from "@/utils/common/helpers/format/vague-date"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import { EInterviewLocation } from "@/types/common/enums/interview-location"
import { EInterviewType } from "@/types/common/enums/interview-type"
import { EStepType } from "@/types/common/enums/step-type"
import { cn } from "@/lib/utils"
import useInterviewLocationOptions from "@/hooks/common/options/Interview-location-options"
import useInterviewTypeOptions from "@/hooks/common/options/Interview-type-options"
import useStepTypeOptions from "@/hooks/common/options/step-type-options"
import { Separator } from "@/components/ui/separator"

type StepCardProps = {
  position: number
  date: string
  stepType: EStepType | "apply"
  remarks: string | null
  interviewLocation: EInterviewLocation | null
  interviewType: EInterviewType | null
  isHighlighted: boolean
}

export default function StepCard({
  position,
  date,
  stepType,
  interviewLocation,
  interviewType,
  remarks,
  isHighlighted,
}: StepCardProps) {
  const t = useI18n()
  const interviewTypeOptions = useInterviewTypeOptions()
  const interviewLocationOptions = useInterviewLocationOptions()
  const stepTypeOptions = useStepTypeOptions()
  const tags = [
    interviewTypeOptions.find((o) => o.value === interviewType)?.label,
    interviewLocationOptions.find((o) => o.value === interviewLocation)?.label,
  ].filter(Boolean)
  const locale = useCurrentLocale()
  stepType
  const rejected =
    stepType == EStepType.REJECTED || stepType == EStepType.WITHDRAWN
  return (
    <div className="relative flex w-full items-start">
      {" "}
      {/* Full width for consistency */}
      {/* Number Badge - Anchor for the line */}
      <div
        className={cn(
          "z-10 hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs md:flex  ",
          isHighlighted && !rejected
            ? getStepTypeStyle(stepType)
            : "border border-slate-200"
        )}
      >
        {position}
      </div>
      {/* Comment Content - Takes up remaining space */}
      <div className="ml-4 flex-1">
        {" "}
        {/* Shifted right and grows to fill space */}
        <div className="flex-start flex">
          <p
            className={cn(
              "rounded-t-sm bg-slate-200 px-[10px] py-[2px] text-xs font-medium text-slate-600",
              isHighlighted && !rejected && getStepTypeStyle(stepType)
            )}
          >
            {formatVagueDateHelper(date, locale)}
          </p>
        </div>
        <div className="rounded-t-r-sm w-full rounded-b-sm bg-white p-4 ">
          {" "}
          {/* Full width within flex-1 */}
          <div className="flex items-center justify-between">
            <div className="flex flex-row gap-[10px]">
              <div
                className={cn(
                  "rounded-sm bg-slate-100 p-1 text-slate-400",
                  isHighlighted && getStepTypeStyle(stepType)
                )}
              >
                {getStepTypeIcon(stepType)}
              </div>
              <p
                className={cn(
                  isHighlighted && getStepTypeStyle(stepType),
                  "bg-transparent text-base font-bold"
                )}
              >
                {stepType === "apply"
                  ? t("job_journey.step_type.submit_application")
                  : stepTypeOptions.find((o) => o.value === stepType)?.label}
              </p>
            </div>
            <div className="flex flex-row gap-[10px]">
              {tags.map((tag, index) => (
                <p
                  key={index}
                  className="flex items-center rounded-lg bg-indigo-50 px-[10px] py-[2px] text-xs font-medium text-indigo-700"
                >
                  {tag}
                </p>
              ))}
            </div>
          </div>
          {remarks && (
            <>
              <Separator className="mt-[10px]" />
              <p className="mt-[10px] whitespace-pre-line break-words text-sm font-normal text-slate-700">
                {remarks}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
