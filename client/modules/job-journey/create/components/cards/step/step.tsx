import React, { useEffect } from "react"
import { useI18n } from "@/utils/services/internationalization/client"
import { useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import useInterviewLocationOptions from "@/hooks/common/options/Interview-location-options"
import useInterviewTypeOptions from "@/hooks/common/options/Interview-type-options"
import useStepTypeOptions from "@/hooks/common/options/step-type-options"
import FormDatePicker from "@/components/customized-ui/form/date-picker"
import FormSelect from "@/components/customized-ui/form/select"
import FormTextArea from "@/components/customized-ui/form/text-area"
import { Icons } from "@/components/icons"

interface IStepCardProps {
  index: number
  position: number
  onRemoveStep: (index: number) => void
  showRemoveButton?: boolean
  className?: string
  isFirstStep?: boolean
}

const StepCard: React.FunctionComponent<IStepCardProps> = ({
  index,
  position,
  onRemoveStep,
  className,
  showRemoveButton = true,
  isFirstStep,
}) => {
  const t = useI18n()
  const {
    control,
    watch,
    setValue, // Add setValue to reset fields
  } = useFormContext()

  const typeOptions = useStepTypeOptions()
  const interviewTypeOptions = useInterviewTypeOptions()
  const interviewLocationsOptions = useInterviewLocationOptions()
  const applicationDateWatch = watch("applicationDate")

  const stepsWatch = watch("steps")

  // Watch the current step's type
  const stepType = watch(`steps.${index}.type`)

  // Filter out "offer", "rejected", "withdrawn" for all non-last-step cards
  const filteredTypeOptions =
    position < stepsWatch.length
      ? typeOptions.filter(
          (option) => !["offer", "rejected", "withdrawn"].includes(option.value)
        )
      : typeOptions

  // Determine the minimum date for this step
  const getMinDate = () => {
    if (index === 0) {
      return applicationDateWatch || new Date(1900, 0, 1)
    } else {
      const previousStep = stepsWatch?.[index - 1]
      return previousStep?.date || applicationDateWatch || new Date(1900, 0, 1)
    }
  }

  const minDate = getMinDate()

  useEffect(() => {
    if (isFirstStep) {
      setValue(`steps.${index}.date`, applicationDateWatch)
      setValue(`steps.${index}.remarks`, null)
      setValue(`steps.${index}.stepType`, null)
    }
  }, [])

  useEffect(() => {
    if (stepType !== "interview") {
      setValue(`steps.${index}.interviewType`, null)
      setValue(`steps.${index}.interviewLocation`, null)
    }
  }, [stepType, setValue, index])

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center  ",
        index !== 0 && "p-10  pt-8",
        className
      )}
    >
      <div className={cn(" w-full ", index !== 0 && "md:basis-8/12")}>
        <div className="flex w-full flex-row justify-between ">
          <p className="text-base font-bold text-slate-500">
            {t("job_journey.general.step")} {index + 1}
          </p>

          {showRemoveButton && (
            <Icons.trashBin
              className="cursor-pointer  text-indigo-600"
              type="button"
              onClick={() => onRemoveStep(index)}
              height={20}
              width={20}
            />
          )}
        </div>
        <div className="mt-5 flex flex-row items-start justify-between space-x-16">
          <FormSelect
            name={`steps.${index}.type`}
            label={t("job_journey.general.step_type")}
            options={filteredTypeOptions}
            control={control}
            labelClassName="text-slate-500"
            containerClassName="basis-full"
            isRequired
          />
          <div className="flex w-full flex-row">
            <div className="basis-full">
              <FormDatePicker
                name={`steps.${index}.date`}
                label={t("general.date")}
                control={control}
                labelClassName="text-slate-500 mt-1"
                containerClassName="basis-full content-start"
                disabledDates={(date) => date < minDate}
                description={t("job_journey.form.date.description")}
                descriptionClassName="text-indigo-400 text-xs"
                isRequired
              />
            </div>
          </div>
        </div>

        {stepType === "interview" && (
          <div className="mt-5 flex flex-row items-start justify-between space-x-16">
            <FormSelect
              name={`steps.${index}.interviewType`}
              label={t("job_journey.general.interview_type")}
              options={interviewTypeOptions}
              control={control}
              labelClassName="text-slate-500"
              containerClassName="basis-full"
              isRequired
            />
            <div className="flex w-full flex-row">
              <div className="basis-full">
                <FormSelect
                  name={`steps.${index}.interviewLocation`}
                  label={t("job_journey.general.interview_location")}
                  options={interviewLocationsOptions}
                  control={control}
                  labelClassName="text-slate-500"
                  containerClassName="basis-full"
                  isRequired
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 ">
          <FormTextArea
            name={`steps.${index}.remarks`}
            label={t("job_journey.general.remarks")}
            control={control}
            placeholder={t("job_journey.form.step_remarks_placeholder")}
          />
        </div>
      </div>
    </div>
  )
}

export default StepCard
