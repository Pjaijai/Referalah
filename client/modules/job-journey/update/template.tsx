"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { JOURNEY_FINAL_STEPS } from "@/modules/job-journey/constant"
import UpdatePreviewSection from "@/modules/job-journey/update/components/sections/preview"
import UpdateSection from "@/modules/job-journey/update/components/sections/update"
import {
  UpdateJobJourneyFormProvider,
  useUpdateJobJourneyFormContext,
} from "@/modules/job-journey/update/hooks/forms/form-context"
import { useI18n } from "@/utils/services/internationalization/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import {
  TJobJourneyWithSteps,
  TUpdateJobJourneyRequest,
} from "@/types/api/job-journey"
import { TLocationData } from "@/types/api/response/location"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useUpdateJobJourney } from "@/hooks/api/job-journey/job-journey"
import useUserStore from "@/hooks/state/user/store"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export interface IUpdateStep {
  type: string
  date: string
  remarks: string | null
  position: number
  interviewLocation: string | null
  interviewType: string | null
}

interface IUpdateJobJourneyPageTemplateProps {
  jobJourney: TJobJourneyWithSteps
  locationData: TLocationData[]
}

const UpdateJobJourneyPageTemplate: React.FC<
  IUpdateJobJourneyPageTemplateProps
> = ({ jobJourney, locationData }) => {
  const router = useRouter()
  const { toast } = useToast()
  const t = useI18n()

  const disabledUpdate = JOURNEY_FINAL_STEPS.includes(
    jobJourney.last_step_status
  )

  const formSchema = z
    .object({
      title: z
        .string()
        .min(1, {
          message: t("validation.field_required"),
        })
        .max(100, {
          message: t("validation.text.maximum_length", { count: 100 }),
        }),
      description: z
        .string()
        .min(10, {
          message: t("validation.text.minimum_length", { count: 10 }),
        })
        .max(3000, {
          message: t("validation.text.maximum_length", { count: 3000 }),
        }),
      steps: z.array(
        z
          .object({
            type: z
              .string()
              .min(1, { message: t("validation.field_required") })
              .max(50, { message: "Step Type cannot exceed 50 characters" }),
            date: z.coerce.date().min(new Date(1900, 0, 1), {
              message: "Date must be after 1900",
            }),
            remarks: z
              .string()
              .max(1000, {
                message: t("validation.text.maximum_length", { count: 1000 }),
              })
              .nullable(),
            interviewType: z
              .string()
              .max(50, {
                message: "Interview Type cannot exceed 50 characters",
              })
              .nullable()
              .optional(),
            interviewLocation: z
              .string()
              .max(50, {
                message: "Interview Location cannot exceed 50 characters",
              })
              .nullable()
              .optional(),
          })
          .superRefine((data, ctx) => {
            if (data.type === "interview") {
              if (!data.interviewType) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t("validation.field_required"),
                  path: ["interviewType"],
                })
              }
              if (!data.interviewLocation) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t("validation.field_required"),
                  path: ["interviewLocation"],
                })
              }
            }
          })
      ),
    })
    .superRefine((data, ctx) => {
      // Validate step date order
      const steps = data.steps

      for (let i = 1; i < steps.length; i++) {
        const prevStep = steps[i - 1]
        const currentStep = steps[i]
        if (currentStep.date < prevStep.date) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("job_journey.form.date_error_message"),
            path: ["steps", i, "date"],
          })
        }
      }
    })

  type UpdateJobJourneyFormData = z.infer<typeof formSchema>

  const FormContent: React.FC = () => {
    const existingStepsCount = jobJourney.job_journey_step?.length || 0

    // Convert existing data to form format
    const defaultValues: UpdateJobJourneyFormData = {
      title: jobJourney.title,
      description: jobJourney.description || "",
      steps: [
        // Existing steps
        ...(jobJourney.job_journey_step || []).map((step) => ({
          type: step.step_type,
          date: new Date(step.step_date),
          remarks: step.remarks,
          interviewLocation: step.interview_location,
          interviewType: step.interview_type,
        })),
      ],
    }

    const form = useForm<UpdateJobJourneyFormData>({
      resolver: zodResolver(formSchema),
      defaultValues,
    })

    const {
      handleSubmit,
      trigger,
      watch,
      formState: { errors },
    } = form

    // Watch for changes in description and steps
    const currentDescription = watch("description")
    const currentSteps = watch("steps")

    // Check if there are any changes
    const hasDescriptionChanged =
      currentDescription?.trim() !== (jobJourney.description || "").trim()

    // New steps are steps beyond the existing ones
    const newSteps = currentSteps.slice(existingStepsCount)
    const hasNewSteps = newSteps.length > 0
    const hasChanges = hasDescriptionChanged || hasNewSteps

    const {
      mutate: update,
      isLoading: isUpdateLoading,
      isError,
      isSuccess,
    } = useUpdateJobJourney(jobJourney.uuid)

    const onSubmit = (data: UpdateJobJourneyFormData) => {
      const steps = data.steps || []

      // Only submit new steps (steps beyond the existing ones)
      const newSteps = steps.slice(existingStepsCount)

      // Calculate starting position for new steps (after the last existing step)
      const startingPosition = existingStepsCount + 1

      const submissionData: TUpdateJobJourneyRequest = {
        title: data.title, // Keep for API compatibility, though backend may not use it
        description: data.description,
        steps: newSteps.map((step, index) => ({
          type: step.type,
          date: step.date.toISOString(),
          remarks: step.remarks,
          position: startingPosition + index,
          interviewLocation: step.interviewLocation || null,
          interviewType: step.interviewType || null,
        })),
      }

      update(submissionData, {
        onSuccess: () => {
          toast({
            title: t("job_journey.form.submit.success"),
          })
          router.push(
            `${siteConfig.page.viewJobJourney.href}/${jobJourney.uuid}`
          )
        },
      })
    }

    const { nextStep, prevStep, currentStep, isLastStep } =
      useUpdateJobJourneyFormContext()

    const handleBackStep = () => {
      prevStep()
      window.scrollTo({ top: 0, behavior: "instant" })
    }

    const handleNextStep = async () => {
      let isValid = false

      if (currentStep === 1) {
        isValid = await trigger(["title", "description", "steps"])
      }

      if (isValid) {
        nextStep()
        window.scrollTo({ top: 0, behavior: "instant" })
      }
    }

    return (
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 1 && (
            <UpdateSection
              existingStepsCount={existingStepsCount}
              disabledUpdate={disabledUpdate}
            />
          )}
          {currentStep === 2 && (
            <UpdatePreviewSection
              jobJourney={form.getValues()}
              locationList={locationData}
              originalJobJourney={jobJourney}
            />
          )}
          <div
            className={cn(
              "flex flex-col justify-between gap-4 bg-transparent px-10  pt-6"
            )}
          >
            {isError && (
              <div className="w-full text-center text-red-600">
                {t("general.error.title")}
                {t("general.error.description")}
              </div>
            )}

            <div className={"flex w-full flex-row justify-end"}>
              <div className="flex flex-row justify-end">
                {currentStep !== 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBackStep}
                    disabled={currentStep === 1}
                    size="sm"
                  >
                    {t("general.back")}
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    if (isLastStep) {
                      if (disabledUpdate) return
                      handleSubmit(onSubmit)()
                    } else {
                      handleNextStep()
                    }
                  }}
                  variant={isLastStep ? "theme" : "themeSecondary"}
                  size="sm"
                  className={cn(
                    !isLastStep && " border-indigo-600 hover:bg-indigo-50"
                  )}
                  disabled={
                    isUpdateLoading ||
                    isSuccess ||
                    disabledUpdate ||
                    !hasChanges
                  }
                >
                  {isLastStep
                    ? t("general.confirm")
                    : isUpdateLoading || isSuccess
                    ? t("general.wait")
                    : t("form.general.next")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    )
  }

  if (jobJourney.created_by !== useUserStore.getState().uuid) {
    return null
  }

  return (
    <UpdateJobJourneyFormProvider>
      <FormContent />
    </UpdateJobJourneyFormProvider>
  )
}

export default UpdateJobJourneyPageTemplate
