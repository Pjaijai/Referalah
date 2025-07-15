"use client"

import React from "react"
import { useRouter } from "next/navigation"
import StepIndicator from "@/modules/job-journey/component/step-indicator/step-indicator"
import BasicInfoSection from "@/modules/job-journey/create/components/sections/basic-info"
import PreviewSection from "@/modules/job-journey/create/components/sections/preview"
import StepSection from "@/modules/job-journey/create/components/sections/step"
import {
  JobJourneyFormProvider,
  useJobJourneyFormContext,
} from "@/modules/job-journey/create/hooks/forms/form-context"
import { useI18n } from "@/utils/services/internationalization/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import * as z from "zod"

import { TCreateJobJourneyRequest } from "@/types/api/job-journey"
import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useCreateJobJourney } from "@/hooks/api/job-journey/job-journey"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import CommonPageLayout from "@/components/layouts/common"

export interface IStep {
  type: string
  date: string
  remarks: string | null
  position: number
}

const getEndOfToday = () => {
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return today
}

interface ICreateJobJourneyPageTemplateProps {
  industryData: IIndustryResponse[]
  locationData: TLocationData[]
}

const CreateJobJourneyPageTemplate: React.FC<
  ICreateJobJourneyPageTemplateProps
> = ({ industryData, locationData }) => {
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

      positionTitle: z
        .string()
        .min(1, {
          message: t("validation.field_required"),
        })
        .max(100, {
          message: t("validation.text.maximum_length", { count: 100 }),
        }),
      company: z
        .object({
          id: z.number(),
          name: z
            .string()
            .min(1, { message: t("validation.field_required") })
            .max(1000, {
              message: "Company name cannot exceed 1000 characters",
            }),
          url: z
            .string()
            .url({ message: t("validation.link.not_valid") })
            .max(2000, {
              message: t("validation.text.maximum_length", { count: 2000 }),
            })
            .optional(),
        })
        .nullable(),
      industry: z
        .string()
        .min(1, {
          message: t("validation.field_required"),
        })
        .max(100, {
          message: t("validation.text.maximum_length", { count: 100 }),
        }),
      location: z
        .string()
        .min(1, {
          message: t("validation.field_required"),
        })
        .max(100, {
          message: t("validation.text.maximum_length", { count: 100 }),
        }),
      jobType: z
        .string()
        .min(1, { message: t("validation.field_required") })
        .max(50, { message: "Job Type cannot exceed 50 characters" }),
      jobLevel: z
        .string()
        .min(1, { message: t("validation.field_required") })
        .max(50, { message: "Job Level cannot exceed 50 characters" }),
      applicationDate: z.coerce
        .date()
        .min(new Date(1900, 0, 1), { message: "Date must be after 1900" })
        .max(getEndOfToday(), {
          message: "Application date cannot be tomorrow or later",
        }),
      source: z
        .string()
        .min(1, { message: t("validation.field_required") })
        .max(100, { message: "Source cannot exceed 100 characters" }),
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
      newCompany: z
        .string()
        .max(100, {
          message: t("validation.text.maximum_length", { count: 100 }),
        })
        .nullable(),
    })
    .superRefine((data, ctx) => {
      if (!data.company && !data.newCompany) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.field_required"),
          path: ["company"],
        })
      }
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
    .superRefine((data, ctx) => {
      // Validate step1 date against applicationDate
      const steps = data.steps

      if (data.steps && data.steps.length > 0) {
        const step1 = steps[0]
        if (step1 && step1.date < data.applicationDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Step 1 date cannot be earlier than application date",
            path: ["steps", 0, "date"],
          })
        }
      }
    })

  type JobJourneyFormData = z.infer<typeof formSchema>

  const FormContent: React.FC = () => {
    const form = useForm<JobJourneyFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        company: null,
        industry: "",
        location: "",
        jobType: "",
        jobLevel: "",
        applicationDate: new Date(),
        source: "",
        description: "",
        steps: [{ type: "", date: undefined, remarks: "" }],
        newCompany: null,
        positionTitle: "",
      },
    })

    const {
      handleSubmit,
      trigger,
      formState: { errors },
    } = form

    const {
      mutate: create,
      isLoading: isCreateLoading,
      isError,
      isSuccess,
    } = useCreateJobJourney()

    const onSubmit = (data: JobJourneyFormData) => {
      const applicationDate = data.applicationDate
      const steps = data.steps || []

      const submissionData: TCreateJobJourneyRequest = {
        title: data.title,
        description: data.description,
        positionTitle: data.positionTitle,
        company: data.company?.id || null,
        industry: data.industry,
        location: data.location,
        jobType: data.jobType,
        jobLevel: data.jobLevel,
        applicationDate: applicationDate.toISOString(),
        source: data.source,
        steps: steps.map((step, index) => ({
          type: step.type,
          date: step.date.toISOString(),
          remarks: step.remarks,
          position: index + 1,
          interviewLocation: step.interviewLocation || null,
          interviewType: step.interviewType || null,
        })),
        newCompany: data.newCompany,
      }

      create(submissionData, {
        onSuccess: (data: any) => {
          toast({
            title: t("job_journey.form.submit.success"),
          })
          router.push(
            `${siteConfig.page.viewJobJourney.href}/${data.data.job_journey_uuid}`
          )
        },
      })
    }

    const { nextStep, prevStep, currentStep, isLastStep } =
      useJobJourneyFormContext()

    const handleBackStep = () => {
      prevStep()
      window.scrollTo({ top: 0, behavior: "instant" })
    }
    const handleNextStep = async () => {
      let isValid = false

      if (currentStep === 1) {
        isValid = await trigger([
          "positionTitle",
          "company",
          "industry",
          "location",
          "applicationDate",
          "source",
          "newCompany",
          "jobLevel",
          "jobType",
        ])
      } else if (currentStep === 2) {
        isValid = await trigger(["steps", "description", "title"])
      }

      if (isValid) {
        nextStep()
        window.scrollTo({ top: 0, behavior: "instant" })
      }
    }

    return (
      <CommonPageLayout
        title={t("page.create_job_journey")}
        className={cn(" mb-12 max-w-full", isLastStep && " mb-0 ")}
        titleClassName={cn(isLastStep ? "hidden" : "block")}
      >
        <StepIndicator />
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <BasicInfoSection
                industryData={industryData}
                locationData={locationData}
              />
            )}
            {currentStep === 2 && <StepSection />}
            {currentStep === 3 && (
              <PreviewSection
                jobJourney={form.getValues()}
                locationList={locationData}
              />
            )}
            <div
              className={cn(
                " flex flex-col justify-between gap-4 bg-white px-10 pb-10 pt-6",
                currentStep >= 2 && "bg-transparent"
              )}
            >
              {isError && (
                <div className="w-fll t text-center text-destructive ">
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
                      disabled={isCreateLoading || isSuccess}
                    >
                      {isLastStep
                        ? t("form.general.submit")
                        : isCreateLoading || isSuccess
                        ? t("general.wait")
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
                    disabled={isCreateLoading || isSuccess}
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
    <JobJourneyFormProvider>
      <FormContent />
    </JobJourneyFormProvider>
  )
}

export default CreateJobJourneyPageTemplate
