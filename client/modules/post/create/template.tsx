"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import usePostTypeOptions from "@/modules/post/hooks/post-type-options"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { IIndustryResponse } from "@/types/api/response/industry"
import { TLocationData } from "@/types/api/response/location"
import { EPostType } from "@/types/common/post-type"
import { EUserStatus } from "@/types/common/user-status"
import { siteConfig } from "@/config/site"
import useCreatePost from "@/hooks/api/post/create-post"
import useIndustryOptions from "@/hooks/common/options/industry-options"
import useLocationOptionsList from "@/hooks/common/options/location-options-list"
import useUserStore from "@/hooks/state/user/store"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import FormTextInput from "@/components/customized-ui/form/input"
import FormNumberInput from "@/components/customized-ui/form/number"
import FormSelect from "@/components/customized-ui/form/select"
import FormTextArea from "@/components/customized-ui/form/text-area"

interface ICreatePostTemplateProps {
  locationList: TLocationData[]
  industryList: IIndustryResponse[]
}

const CreatePostTemplate: React.FunctionComponent<ICreatePostTemplateProps> = ({
  locationList,
  industryList,
}) => {
  const t = useI18n()
  const locale = useCurrentLocale()

  const createPostValidationSchema = z
    .object({
      url: z
        .string()
        .max(20000, {
          message: t("validation.text.maximum_length", { count: 20000 }),
        })
        .url({
          message: t("validation.link.not_valid"),
        })
        .optional()
        .or(z.literal("")),
      description: z
        .string()
        .max(3000, {
          message: t("validation.text.maximum_length", { count: 3000 }),
        })
        .min(10, {
          message: t("validation.text.minimum_length", { count: 10 }),
        }),
      type: z.enum(
        [
          EPostType.REFEREE,
          EPostType.REFERRER,
          EPostType.HIRING,
          EPostType.COLLABORATION,
        ],
        {
          required_error: t("validation.field_required"),
        }
      ),

      locationUuid: z.string().min(1, {
        message: t("validation.field_required"),
      }),
      industryUuid: z.string().min(1, {
        message: t("validation.field_required"),
      }),
      yearOfExperience: z
        .string()
        .min(1, {
          message: t("validation.field_required"),
        })
        .refine(
          (value) => {
            if (value) {
              const number = parseFloat(value)
              if (!isNaN(number) && number >= 0 && number <= 100) {
                return true
              } else {
                return false
              }
            }

            return true
            // Check if it's a valid number and falls within the range 1 to 100
          },
          {
            message: t("validation.year_of_experience.exceed_range"), // Specify the custom error message here
          }
        ),
      companyName: z
        .string()
        .min(1, {
          message: t("validation.field_required"),
        })
        .max(100, {
          message: t("validation.text.maximum_length", { count: 100 }),
        })
        .trim()
        .refine((val) => val.trim().length > 0, {
          message: t("validation.field_required"), // Custom error for whitespace-only
        }),
      jobTitle: z
        .string()
        .min(1, {
          message: t("validation.field_required"),
        })
        .max(100, {
          message: t("validation.text.maximum_length", { count: 100 }),
        })
        .trim()
        .refine((val) => val.trim().length > 0, {
          message: t("validation.field_required"), // Custom error for whitespace-only
        }),
    })
    .refine(
      (data) => {
        // Ensure URL is required when type is REFERRER
        if (data.type === EPostType.REFEREE) {
          return data.url && data.url !== ""
        }

        return true
      },
      {
        message: t("validation.url.referee.required"),
        path: ["url"],
      }
    )

  const form = useForm<z.infer<typeof createPostValidationSchema>>({
    resolver: zodResolver(createPostValidationSchema),
    defaultValues: {
      description: "",
      companyName: "",
      jobTitle: "",
      yearOfExperience: "0",
      locationUuid: "",
      industryUuid: "",
      url: "",
    },
  })
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const yearOfExperienceWatch = form.watch("yearOfExperience")
  const urlWatch = form.watch("url")
  const router = useRouter()
  const user = useUserStore((state) => state)

  const industryOptions = useIndustryOptions(industryList)
  const locationOptions = useLocationOptionsList(locationList, false, locale)
  const typeOptions = usePostTypeOptions()
  const { mutate: createPost, isLoading: isCreatePostLoading } = useCreatePost()

  useEffect(() => {
    if (urlWatch === "") {
      form.setValue("url", undefined)
    }
  }, [form, urlWatch])

  useEffect(() => {
    // Convert yearOfExperienceWatch to a number
    const yearOfExperienceWatchNumber = parseFloat(yearOfExperienceWatch)

    // Check if yearOfExperienceWatchNumber is a valid number and not NaN
    if (
      !isNaN(yearOfExperienceWatchNumber) &&
      typeof yearOfExperienceWatchNumber === "number"
    ) {
      // If yearOfExperienceWatchNumber is negative, set yearOfExperience to '0'
      if (yearOfExperienceWatchNumber < 0) {
        form.setValue("yearOfExperience", "0")
      } else {
        // Round yearOfExperienceWatchNumber to the nearest integer and set it as yearOfExperience
        const roundedValue = Math.round(yearOfExperienceWatchNumber)
        form.setValue("yearOfExperience", roundedValue.toString())
      }
    } else {
      // Handle cases where yearOfExperienceWatchNumber is not a valid number
      // Set a default value or handle it as needed
      form.setValue("yearOfExperience", "0")
    }
  }, [form, yearOfExperienceWatch])

  const onSubmit = async (
    values: z.infer<typeof createPostValidationSchema>,
    e: any
  ) => {
    e.preventDefault()

    if (user.status !== EUserStatus.ACTIVE) {
      return toast({
        title: t("general.action_restricted_please_contact_admin"),
        variant: "destructive",
      })
    }

    try {
      if (!user.isSignIn)
        return toast({
          title: t("post.create.error.user_not_sign_in_title"),
          description: t("post.create.error.user_not_sign_in_description"),
          variant: "destructive",
          action: (
            <ToastAction altText={t("general.sign_in")}>
              <Link href={siteConfig.page.signIn.href}>
                {t("general.sign_in")}
              </Link>
            </ToastAction>
          ),
        })

      setIsSubmitting(true)

      createPost(
        {
          url: values.url,
          locationUuid: values.locationUuid,
          industryUuid: values.industryUuid,
          yearOfExperience: parseInt(values.yearOfExperience),
          type: values.type,
          companyName: values.companyName.trim(),
          jobTitle: values.jobTitle.trim(),
          description: values.description.trim(),
        },
        {
          onSuccess: (res) => {
            router.push(`${siteConfig.page.viewPost.href}/${res.uuid}`)
          },
          onError: () => {
            setIsSubmitting(false)
            return toast({
              title: t("general.error.title"),
              description: t("general.error.description"),
              variant: "destructive",
            })
          },
        }
      )
    } catch (err) {
      return toast({
        title: t("general.error.title"),
        description: t("general.error.description"),
      })
    }
  }

  return (
    <div className=" flex h-full w-full flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg"
        >
          <FormSelect
            options={typeOptions}
            control={form.control}
            label={t("post.create.type_label")}
            name="type"
            triggerClassName="h-fit "
            itemClassName="h-fit w-screen md:w-full"
          />
          <FormTextInput
            control={form.control}
            label={t("post.create.related_link_title")}
            name="url"
            description={t("post.create.related_link_description")}
          />

          <FormTextInput
            control={form.control}
            label={t("general.company_name")}
            name="companyName"
          />

          <FormTextInput
            control={form.control}
            label={t("general.job_title")}
            name="jobTitle"
          />

          <FormTextArea
            control={form.control}
            label={t("post.create.content_label")}
            name="description"
          />

          <FormSelect
            options={industryOptions}
            control={form.control}
            label={t("general.industry")}
            name="industryUuid"
          />

          <FormSelect
            options={locationOptions}
            control={form.control}
            label={t("general.location")}
            name="locationUuid"
          />

          <FormNumberInput
            control={form.control}
            label={t("general.year_of_experience")}
            name="yearOfExperience"
          />

          <Button type="submit" disabled={isCreatePostLoading || isSubmitting}>
            {isSubmitting ? t("general.wait") : t("form.general.submit")}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default CreatePostTemplate
