import React from "react"
import StepCard from "@/modules/job-journey/view/components/cards/step/step"

import { TJobJourneyStep } from "@/types/api/job-journey"

type StepsTimelineProps = {
  steps: TJobJourneyStep[]
  applicationDate: string
}

export default function StepsTimeline({
  steps,
  applicationDate,
}: StepsTimelineProps) {
  const sortedSteps = [...steps].sort((a, b) => b.position - a.position)

  return (
    <div className="relative px-4 py-5">
      <div className="space-y-8">
        {sortedSteps.map((step, index) => (
          <div key={step.id} className="relative">
            <StepCard
              position={step.position + 1}
              date={step.step_date}
              stepType={step.step_type}
              interviewLocation={step.interview_location}
              interviewType={step.interview_type}
              remarks={step.remarks}
              isHighlighted={index === 0}
            />
            {/* Vertical Line: Connects from badge center to next badge */}
            {index < sortedSteps.length - 1 && (
              <div
                className="absolute left-[14px] top-4 w-[1.5px] border-l-[1.5px] border-dashed border-gray-300"
                style={{ height: "calc(100% + 2rem)" }}
              />
            )}
            <div
              className="absolute left-[14px] top-4 w-[1.5px] border-l-[1.5px] border-dashed border-gray-300"
              style={{ height: "calc(100% + 2rem)" }}
            />
          </div>
        ))}

        <StepCard
          position={1}
          date={applicationDate}
          stepType={"apply"}
          interviewLocation={null}
          interviewType={null}
          remarks={""}
          isHighlighted={false}
        />
      </div>
    </div>
  )
}
