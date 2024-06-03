"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import usePostTypeOptions from "@/modules/post/hooks/post-type-options"
import { useI18n } from "@/utils/services/internationalization/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { EPostType } from "@/types/common/post-type"
import { siteConfig } from "@/config/site"
import useCreatePost from "@/hooks/api/post/create-post"
import useCityOptions from "@/hooks/common/options/city-options"
import useCountryOptions from "@/hooks/common/options/country-options"
import useIndustryOptions from "@/hooks/common/options/industry-options"
import useProvinceOptions from "@/hooks/common/options/province-options"
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
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  industryList: IIndustryResponse[]
}

const CreatePostTemplate: React.FunctionComponent<ICreatePostTemplateProps> = ({
  countryList,
  provinceList,
  cityList,
  industryList,
}) => {
  const t = useI18n()

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

      countryUuid: z.string().min(1, {
        message: t("validation.field_required"),
      }),
      provinceUuid: z.string().min(1, {
        message: t("validation.field_required"),
      }),
      cityUuid: z.string().min(1, {
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
        }),
      jobTitle: z
        .string()
        .min(1, {
          message: t("validation.field_required"),
        })
        .max(100, {
          message: t("validation.text.maximum_length", { count: 100 }),
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
      countryUuid: "",
      provinceUuid: "",
      cityUuid: "",
      industryUuid: "",
      url: "",
    },
  })
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const countryWatch = form.watch("countryUuid")
  const provinceWatch = form.watch("provinceUuid")
  const yearOfExperienceWatch = form.watch("yearOfExperience")
  const urlWatch = form.watch("url")
  const router = useRouter()
  const user = useUserStore((state) => state)

  const industryOptions = useIndustryOptions(industryList)
  const countryOptions = useCountryOptions(countryList)
  const provinceOptions = useProvinceOptions(provinceList, countryWatch)
  const cityOptions = useCityOptions(cityList, provinceWatch)
  const typeOptions = usePostTypeOptions()
  const { mutate: createPost, isLoading: isCreatePostLoading } = useCreatePost()

  useEffect(() => {
    form.setValue("provinceUuid", "")
    form.setValue("cityUuid", "")
  }, [countryWatch])

  useEffect(() => {
    form.setValue("cityUuid", "")
  }, [provinceWatch])

  useEffect(() => {
    if (urlWatch === "") {
      form.setValue("url", undefined)
    }
  }, [urlWatch])

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
  }, [yearOfExperienceWatch])

  const onSubmit = async (
    values: z.infer<typeof createPostValidationSchema>,
    e: any
  ) => {
    e.preventDefault()
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
          countryUuid: values.countryUuid,
          provinceUuid: values.provinceUuid,
          cityUuid: values.cityUuid,
          industryUuid: values.industryUuid,
          yearOfExperience: parseInt(values.yearOfExperience),
          createdBy: user.uuid!,
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
    <div className=" flex h-full w-full flex-col p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
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
            options={countryOptions}
            control={form.control}
            label={t("general.country")}
            name="countryUuid"
          />
          <FormSelect
            control={form.control}
            label={t("general.region")}
            name="provinceUuid"
            options={provinceOptions as any}
          />

          <FormSelect
            control={form.control}
            label={t("general.city")}
            name="cityUuid"
            options={cityOptions as any}
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
