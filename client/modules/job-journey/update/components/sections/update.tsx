"use client"

import React from "react"
import { JOURNEY_FINAL_STEPS } from "@/modules/job-journey/constant"
import StepCard from "@/modules/job-journey/create/components/cards/step/step"
import SubSection from "@/modules/job-journey/create/components/sections/sub-section"
import { useI18n } from "@/utils/services/internationalization/client"
import { useFieldArray, useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import FormTextArea from "@/components/customized-ui/form/text-area"

interface UpdateSectionProps {
  existingStepsCount: number
  disabledUpdate: boolean // Add lastStepStatus prop
}

const UpdateSection: React.FC<UpdateSectionProps> = ({
  existingStepsCount,
  disabledUpdate,
}) => {
  const t = useI18n()
  const { control, watch } = useFormContext()
  const stepsWatch = watch("steps")
  const applicationDateWatch = watch("applicationDate")

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  })

  // Check if the last step type is a terminal state (for button disablement)
  const isLastStepTerminal = () => {
    if (!stepsWatch || stepsWatch.length === 0) return false
    const lastStep = stepsWatch[stepsWatch.length - 1]
    const terminalTypes = ["offer", "rejected", "withdrawn"]
    return terminalTypes.includes(lastStep?.type)
  }

  const handleRemoveStep = (index: number) => {
    // Only allow removal of newly added steps (not existing ones)
    if (index >= existingStepsCount) {
      remove(index)
    }
  }

  const handleAddStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Determine the date for the new step
    let newStepDate: Date
    if (stepsWatch && stepsWatch.length > 0) {
      // If there are existing steps, use the last step's date
      const lastStep = stepsWatch[stepsWatch.length - 1]
      newStepDate = new Date(lastStep.date)
    } else {
      // If there are no steps, use the applicationDate
      newStepDate = new Date(applicationDateWatch || new Date())
    }

    append({
      type: "",
      date: newStepDate,
      remarks: "",
      interviewLocation: null,
      interviewType: null,
    })
  }

  return (
    <>
      <div className="flex flex-col gap-10 bg-white p-10 pt-8">
        <SubSection title={t("job_journey.sub_section.journey_description")}>
          <FormTextArea
            name={`description`}
            label={t("job_journey.general.description")}
            control={control}
            inputClassName="mt-5 text-slate-500"
            isRequired
            minRows={6}
            placeholder={t("job_journey.form.description_placeholder")}
            isDisabled={disabledUpdate}
          />
        </SubSection>
        <SubSection title={t("job_journey.sub_section.step_details")}>
          <StepCard
            index={0}
            onRemoveStep={handleRemoveStep}
            position={1}
            showRemoveButton={false}
            className="py-0"
            disabled
          />
        </SubSection>
      </div>

      {/* Render remaining steps */}
      {fields.slice(1).map((field, index) => {
        const stepIndex = index + 1
        const isExistingStep = stepIndex < existingStepsCount

        return (
          <div key={field.id} className="relative mt-5 w-full bg-white">
            <StepCard
              index={stepIndex}
              onRemoveStep={handleRemoveStep}
              position={stepIndex + 1}
              showRemoveButton={!isExistingStep}
              disabled={isExistingStep}
            />
          </div>
        )
      })}

      <div className="mt-5 flex w-full items-center justify-center bg-transparent">
        <Button
          type="button"
          variant={"themeOutline"}
          className="border-indigo-400"
          onClick={(e) => handleAddStep(e)}
          disabled={isLastStepTerminal()} // Disable button if last step is terminal
        >
          + {t("general.add_more")}
        </Button>
      </div>
    </>
  )
}

export default UpdateSection
