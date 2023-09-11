"use client"

import React from "react"
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
import FormTextInput from "@/components/customized-ui/form/input"
import FormNumberInput from "@/components/customized-ui/form/number"
import FormSelect from "@/components/customized-ui/form/select"
import FormTextArea from "@/components/customized-ui/form/text-area"

interface ICreatePostTemplateProps {}

const CreatePostTemplate: React.FunctionComponent<
  ICreatePostTemplateProps
> = () => {
  const formSchema = z.object({
    type: z.string().min(1, "need"),
    url: z.string().min(1, "need"),
    description: z
      .string()
      .max(3000, {
        message: `俾盡3000粒字，唔夠用請聯絡我🙏🏻`,
      })
      .min(1, {
        message: `至少有要1粒字`,
      }),

    countryUuid: z.string().min(1, "need"),
    provinceUuid: z.string().min(1, "need"),
    cityUuid: z.string().min(1, "need"),
    industryUuid: z.string().min(1, "need"),
    yearOfExperience: z.string().min(1, "need"),
    companyName: z.string().min(1, "need"),
    jobTitle: z.string().min(1, "need"),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const countryWatch = form.watch("countryUuid")
  const provinceWatch = form.watch("provinceUuid")
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
      title: "Referer",
    },
    {
      value: "referee",
      title: "Referee",
    },
  ]
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("sub,it", values)

    const { error } = await supabase.from("post").insert({
      url: values.url,
      country_uuid: values.countryUuid,
      province_uuid: values.provinceUuid,
      city_uuid: values.cityUuid,
      industry_uuid: values.industryUuid,
      year_of_experience: parseInt(values.yearOfExperience),
      created_by: user.uuid,
      type: values.type,
      company_name: values.companyName,
      job_title: values.jobTitle,
      description: values.description,
    })

    if (error) {
      console.log("errorerrorerrorerror")
    }
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormSelect
            options={postTypeOptions}
            control={form.control}
            label="Type"
            name="type"
          />
          <FormTextInput
            control={form.control}
            label="url"
            name="url"
            description="job ppoers li"
          />

          <FormTextInput
            control={form.control}
            label="comapayname"
            name="companyName"
            description="job ppoers li"
          />

          <FormTextInput
            control={form.control}
            label="jpob title"
            name="jobTitle"
            description="job ppoers li"
          />

          <FormTextArea
            control={form.control}
            label="Description"
            name="description"
            description="description"
            placeholder="description"
          />

          <FormSelect
            options={industryOptions}
            control={form.control}
            label="industry"
            name="industryUuid"
            description="Select your industry"
            placeholder="Select a industry"
          />
          <FormSelect
            options={countryOptions}
            control={form.control}
            label="Country"
            name="countryUuid"
            description="Select your country"
            placeholder="Select a country"
          />
          <FormSelect
            control={form.control}
            label="Province"
            name="provinceUuid"
            options={provinceOptions as any}
            description="Select your province"
            placeholder="Select a province"
          />

          <FormSelect
            control={form.control}
            label="City"
            name="cityUuid"
            options={cityOptions as any}
            description="Select your city"
            placeholder="Select a city"
          />
          <FormNumberInput
            control={form.control}
            label="yearOfExperience"
            name="yearOfExperience"
            description="yearOfExperience"
            placeholder="yearOfExperience"
          />
          <Button type="submit">Save changes</Button>
        </form>
      </Form>
    </div>
  )
}

export default CreatePostTemplate
