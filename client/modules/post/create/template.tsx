"use client"

import { type } from "os"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { maximumWordValidation } from "@/modules/profile/form/validation.ts/max-word"
import { supabase } from "@/utils/services/supabase/config"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import useGetIndustryList from "@/hooks/api/industry/useGetIndustryList"
import useGetCityList from "@/hooks/api/location/useGetCityList"
import useGetCountryList from "@/hooks/api/location/useGetCountryList"
import useGetProvinceList from "@/hooks/api/location/useGetProvinceList"
import useCityOptions from "@/hooks/common/options/useCityOptions"
import useCountryOptions from "@/hooks/common/options/useCountryOptions"
import useIndustryOptions from "@/hooks/common/options/useIndustryOptions"
import useProvinceOptions from "@/hooks/common/options/useProvinceOptions"
import useUserStore from "@/hooks/state/user/useUserStore"
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
  const formSchema = z.object({
    type: z.string().nonempty("俾幫手填下🙏🏻"),
    url: maximumWordValidation(250)
      .url({
        message: "無效連結",
      })
      .refine(
        (value) => {
          return value.trim() !== "" // Add your custom validation logic here
        },
        {
          message: "俾幫手填下🙏🏻", // Specify the custom error message here
        }
      ),
    description: z
      .string()
      .max(3000, {
        message: `俾盡3000粒字，唔夠用請聯絡我🙏🏻`,
      })
      .min(1, {
        message: `至少有要1粒字`,
      }),

    countryUuid: z.string().min(1, {
      message: `俾幫手填下🙏🏻`,
    }),
    provinceUuid: z.string().min(1, {
      message: `俾幫手填下🙏🏻`,
    }),
    cityUuid: z.string().min(1, {
      message: `俾幫手填下🙏🏻`,
    }),
    industryUuid: z.string().min(1, {
      message: `俾幫手填下🙏🏻`,
    }),
    yearOfExperience: z
      .string()
      .min(1, {
        message: `俾幫手填下🙏🏻`,
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
          message: "必須喺0到100之間，如果唔夠用請聯絡我🙇🏻‍♂️", // Specify the custom error message here
        }
      ),
    companyName: z.string().min(1, {
      message: `俾幫手填下🙏🏻`,
    }),
    jobTitle: z.string().min(1, {
      message: `俾幫手填下🙏🏻`,
    }),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "referer",
      description: "",
      companyName: "",
      jobTitle: "",
      yearOfExperience: "0",
      countryUuid: "",
      provinceUuid: "",
      cityUuid: "",

      url: "",

      industryUuid: "",
    },
  })
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const countryWatch = form.watch("countryUuid")
  const provinceWatch = form.watch("provinceUuid")
  const yeoWatch = form.watch("yearOfExperience")
  const typeWatch = form.watch("type")
  const router = useRouter()
  const user = useUserStore((state) => state)
  const { industry: industryList } = useGetIndustryList()
  const { city: cityList } = useGetCityList()
  const { country: countryList } = useGetCountryList()
  const { province: provinceList } = useGetProvinceList()
  const industryOptions = useIndustryOptions(industryList)
  const countryOptions = useCountryOptions(countryList)
  const provinceOptions = useProvinceOptions(provinceList, countryWatch)
  const cityOptions = useCityOptions(cityList, provinceWatch)
  const postTypeOptions = [
    {
      value: "referer",
      title: "推薦人",
    },
    {
      value: "referee",
      title: "受薦人",
    },
  ]

  useEffect(() => {
    form.setValue("cityUuid", "")
  }, [provinceWatch])

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user.isSignIn)
      return toast({
        title: "未登入",
        description: "登入咗先可以開Post",
        variant: "destructive",
        action: (
          <ToastAction altText="登入">
            <Link href={"/auth"}>登入</Link>
          </ToastAction>
        ),
      })

    setIsSubmitting(true)

    const { error } = await supabase.from("post").insert({
      url: values.url,
      country_uuid: values.countryUuid,
      province_uuid: values.provinceUuid,
      city_uuid: values.cityUuid,
      industry_uuid: values.industryUuid,
      year_of_experience: parseInt(values.yearOfExperience),
      created_by: user.uuid,
      type: values.type,
      company_name: values.companyName.trim(),
      job_title: values.jobTitle.trim(),
      description: values.description.trim(),
    })

    if (error) {
      return toast({
        title: "出事！",
        description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
      })
    }

    if (values.type === "referer") {
      router.push("/post/referer")
    } else {
      router.push("/post/referee")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="w-full h-full flex flex-col mt-28 p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormSelect
            options={postTypeOptions}
            control={form.control}
            label="類型"
            name="type"
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
            description={
              typeWatch === "referer"
                ? "額外講吓想搵啲咩人？"
                : "大概講吓你自己點解match呢個職位，建議唔好公開自己聯絡資訊。"
            }
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

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "請等等" : "提交"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default CreatePostTemplate
