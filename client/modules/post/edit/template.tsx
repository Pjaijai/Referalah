import React, { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { postStatusOptions } from "@/modules/post/common/post-status-options"
import { editPostValidationSchema } from "@/modules/post/validation/edit"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { IGetPostResponse } from "@/types/api/response/referer-post"
import { ReferralType } from "@/types/common/referral-type"
import { siteConfig } from "@/config/site"
import useGetIndustryList from "@/hooks/api/industry/get-Industry-list"
import useGetCityList from "@/hooks/api/location/get-city-list"
import useGetCountryList from "@/hooks/api/location/get-country-list"
import useGetProvinceList from "@/hooks/api/location/get-province-list"
import useUpdatePost from "@/hooks/api/post/update-post"
import useCityOptions from "@/hooks/common/options/city-options"
import useCountryOptions from "@/hooks/common/options/country-options"
import useIndustryOptions from "@/hooks/common/options/industry-options"
import useProvinceOptions from "@/hooks/common/options/province-pptions"
import useUserStore from "@/hooks/state/user/store"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import FormTextInput from "@/components/customized-ui/form/input"
import FormNumberInput from "@/components/customized-ui/form/number"
import FormSelect from "@/components/customized-ui/form/select"
import FormTextArea from "@/components/customized-ui/form/text-area"

interface IEditPostPageTemplateProps {
  postDate?: IGetPostResponse
  isPostDataLoading: boolean
  postUuid: string
}
const EditPostPageTemplate: React.FunctionComponent<
  IEditPostPageTemplateProps
> = ({ postDate, isPostDataLoading, postUuid }) => {
  const formSchema = editPostValidationSchema
  const isSetInitialValues = useRef(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => {
      isSetInitialValues.current = true
      return {
        status: postDate?.status || "active",
        description: postDate?.description || "",
        companyName: postDate?.company_name || "",
        jobTitle: postDate?.job_title || "",
        yearOfExperience: postDate?.year_of_experience?.toString() || "0",
        url: postDate?.url || "",
        countryUuid: postDate?.country?.uuid || "",
        provinceUuid: postDate?.province?.uuid || "",
        cityUuid: postDate?.city?.uuid || "",
        industryUuid: postDate?.industry?.uuid || "",
      }
    }, [isPostDataLoading]),
  })

  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const countryWatch = form.watch("countryUuid")
  const provinceWatch = form.watch("provinceUuid")
  const yeoWatch = form.watch("yearOfExperience")
  const urlWatch = form.watch("url")
  const router = useRouter()
  const user = useUserStore((state) => state)
  const { data: industryList } = useGetIndustryList()
  const { data: cityList } = useGetCityList()
  const { data: countryList } = useGetCountryList()
  const { data: provinceList } = useGetProvinceList()
  const industryOptions = useIndustryOptions(industryList)
  const countryOptions = useCountryOptions(countryList)
  const provinceOptions = useProvinceOptions(provinceList, countryWatch)
  const cityOptions = useCityOptions(cityList, provinceWatch)
  const { mutate: updatePost, isLoading: isUpdatingPostLoading } =
    useUpdatePost()

  useEffect(() => {
    if (provinceWatch !== postDate?.province?.uuid) {
      form.setValue("cityUuid", "")
    }
  }, [form, isPostDataLoading, provinceWatch])

  useEffect(() => {
    if (urlWatch === "") {
      form.setValue("url", undefined)
    }
  }, [urlWatch])

  useEffect(() => {
    // Convert yeoWatch to a number
    const yeoWatchNumber = parseFloat(yeoWatch)

    // Check if yeoWatchNumber is a valid number and not NaN
    if (!isNaN(yeoWatchNumber) && typeof yeoWatchNumber === "number") {
      // If yeoWatchNumber is negative, set yearOfExperience to '0'
      if (yeoWatchNumber < 0) {
        form.setValue("yearOfExperience", "0")
      } else {
        // Round yeoWatchNumber to the nearest integer and set it as yearOfExperience
        const roundedValue = Math.round(yeoWatchNumber)
        form.setValue("yearOfExperience", roundedValue.toString())
      }
    } else {
      // Handle cases where yeoWatchNumber is not a valid number
      // Set a default value or handle it as needed
      form.setValue("yearOfExperience", "0")
    }
  }, [yeoWatch])

  const onSubmit = async (values: z.infer<typeof formSchema>, e: any) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)

      updatePost(
        {
          uuid: postUuid,
          status: values.status,
          url: values.url,
          countryUuid: values.countryUuid,
          provinceUuid: values.provinceUuid,
          cityUuid: values.cityUuid,
          industryUuid: values.industryUuid,
          yearOfExperience: parseInt(values.yearOfExperience),
          createdBy: user.uuid!,
          type: ReferralType.REFERRER,
          companyName: values.companyName.trim(),
          jobTitle: values.jobTitle.trim(),
          description: values.description.trim(),
        },
        {
          onSuccess: () => {
            router.push(`${siteConfig.page.referrerPost.href}/${postUuid}`)
          },
          onError: () => {
            return toast({
              title: "出事！",
              description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
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
          <FormSelect
            control={form.control}
            label="狀態"
            name="status"
            options={postStatusOptions as any}
          />

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

          <Button type="submit" disabled={isUpdatingPostLoading}>
            {isSubmitting ? "請等等" : "提交"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default EditPostPageTemplate
