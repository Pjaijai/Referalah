"use client"

import React from "react"
import { useRouter } from "next/navigation"
import UpdatePreviewSection from "@/modules/job-journey/update/components/sections/preview"
import UpdateSection from "@/modules/job-journey/update/components/sections/update"
import { useUpdateJobJourney } from "@/modules/job-journey/update/hooks/api/update-job-journey"
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
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import CommonPageLayout from "@/components/layouts/common"

export interface IUpdateStep {
  type: string
  date: string
  remarks: string | null
  position: number
  interviewLocation: string | null
  interviewType: string | null
}

const getEndOfToday = () => {
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return today
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
      formState: { errors },
    } = form

    console.log("Form errors:", errors)

    const {
      mutate: update,
      isLoading: isUpdateLoading,
      isError,
      isSuccess,
    } = useUpdateJobJourney(jobJourney.uuid)

    const onSubmit = (data: UpdateJobJourneyFormData) => {
      const steps = data.steps || []

      const submissionData: TUpdateJobJourneyRequest = {
        title: data.title,
        description: data.description,
        steps: steps.map((step, index) => ({
          type: step.type,
          date: step.date.toISOString(),
          remarks: step.remarks,
          position: index + 1,
          interviewLocation: step.interviewLocation || null,
          interviewType: step.interviewType || null,
        })),
      }

      update(submissionData, {
        onSuccess: () => {
          toast({
            title: "Update successful",
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
      <CommonPageLayout
        title="Update Job Journey"
        className={cn("mb-12 max-w-full", isLastStep && "mb-0")}
        titleClassName={cn(isLastStep ? "hidden" : "block")}
      >
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <UpdateSection existingStepsCount={existingStepsCount} />
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
                "flex flex-col justify-between gap-4 bg-transparent px-10 pb-10 pt-6"
              )}
            >
              {isError && (
                <div className="w-full text-center text-red-600">
                  {t("general.error.title")}
                  {t("general.error.description")}
                </div>
              )}

              {!isLastStep && (
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
                      //   disabled={isCreateLoading || isSuccess}
                    >
                      {/* {isLastStep
                        ? t("form.general.submit")
                        : isCreateLoading || isSuccess
                        ? t("general.wait")
                        : t("form.general.next")} */}

                      {isLastStep
                        ? t("form.general.submit")
                        : t("form.general.next")}
                    </Button>
                  </div>
                </div>
              )}

              {isLastStep && (
                <div className="absolute bottom-0 left-0  flex h-fit w-full flex-col items-center justify-around bg-indigo-50 py-4  md:flex-row md:px-20">
                  <div />
                  <p className="text-indigo-600 ">
                    {t("job_journey.form.preview_mode_and_confirm")}
                  </p>
                  <Button
                    variant={"theme"}
                    type="submit"
                    // disabled={isCreateLoading || isSuccess}
                    size={"lg"}
                    className="mt-4 px-14 py-3 text-sm  md:mt-0"
                  >
                    {t("general.confirm")}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </CommonPageLayout>
    )
  }

  return (
    <UpdateJobJourneyFormProvider>
      <FormContent />
    </UpdateJobJourneyFormProvider>
  )
}

export default UpdateJobJourneyPageTemplate
