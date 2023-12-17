"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createPostValidationSchema } from "@/modules/post/validation/create"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { EReferralType } from "@/types/common/referral-type"
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

interface ICreatePostTemplateProps {}

const CreatePostTemplate: React.FunctionComponent<
  ICreatePostTemplateProps
> = () => {
  const formSchema = createPostValidationSchema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      companyName: "",
      jobTitle: "",
      yearOfExperience: "0",
      countryUuid: "",
      provinceUuid: "",
      cityUuid: "",
      industryUuid: "",
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

  const industryOptions = useIndustryOptions()
  const countryOptions = useCountryOptions()
  const provinceOptions = useProvinceOptions(countryWatch)
  const cityOptions = useCityOptions(provinceWatch)
  const { mutate: createPost, isLoading: isCreatePostLoading } = useCreatePost()

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

  const onSubmit = async (values: z.infer<typeof formSchema>, e: any) => {
    e.preventDefault()
    try {
      if (!user.isSignIn)
        return toast({
          title: "未登入",
          description: "登入咗先可以貼街招",
          variant: "destructive",
          action: (
            <ToastAction altText="登入">
              <Link href={siteConfig.page.signIn.href}>登入</Link>
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
          type: EReferralType.REFERRER,
          companyName: values.companyName.trim(),
          jobTitle: values.jobTitle.trim(),
          description: values.description.trim(),
        },
        {
          onSuccess: (res) => {
            router.push(`${siteConfig.page.referrerPost.href}/${res.uuid}`)
          },
          onError: () => {
            return toast({
              title: "出事！",
              description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
              variant: "destructive",
            })
          },
        }
      )
    } catch (err) {
      return toast({
        title: "出事！",
        description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
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
          <FormTextInput
            control={form.control}
            label="相關網址"
            name="url"
            description="例如份工個LinkedIn，Indeed，Glassdoor個連結"
          />

          <FormTextInput
            control={form.control}
            label="公司名"
            name="companyName"
          />

          <FormTextInput
            control={form.control}
            label="職位名稱"
            name="jobTitle"
          />

          <FormTextArea
            control={form.control}
            label="內容"
            name="description"
            description={"講吓想搵啲咩人？"}
          />

          <FormSelect
            options={industryOptions}
            control={form.control}
            label="行業"
            name="industryUuid"
          />
          <FormSelect
            options={countryOptions}
            control={form.control}
            label="國家"
            name="countryUuid"
          />
          <FormSelect
            control={form.control}
            label="省份"
            name="provinceUuid"
            options={provinceOptions as any}
          />

          <FormSelect
            control={form.control}
            label="城市"
            name="cityUuid"
            options={cityOptions as any}
          />

          <FormNumberInput
            control={form.control}
            label="工作年資"
            name="yearOfExperience"
          />

          <Button type="submit" disabled={isCreatePostLoading}>
            {isSubmitting ? "請等等" : "提交"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default CreatePostTemplate
