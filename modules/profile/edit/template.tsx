import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import FormCheckBox from "@/modules/profile/form/fields/checkbox"
import InputFileField from "@/modules/profile/form/fields/file"
import InputField from "@/modules/profile/form/fields/input"
import FormNumberInputField from "@/modules/profile/form/fields/number"
import FormSelect from "@/modules/profile/form/fields/select"
import FormTextArea from "@/modules/profile/form/fields/textArea"
import { IViewProfileTemplateProps } from "@/modules/profile/view/template"
import { supabase } from "@/utils/services/supabase/config"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import useGetIndustryList from "@/hooks/api/industry/useGetIndustryList"
import useGetCityList from "@/hooks/api/location/useGetCityList"
import useGetCountryList from "@/hooks/api/location/useGetCountryList"
import useGetProvinceList from "@/hooks/api/location/useGetProvinceList"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

interface IEdiProfileTemplate extends IViewProfileTemplateProps {
  slug: string
}

const EditProfileTemplate: React.FunctionComponent<IEdiProfileTemplate> = ({
  photoUrl,
  chineseFirstName,
  chineseLastName,
  englishFirstName,
  englishLastName,
  username,
  description,
  company,
  jobTitle,
  yearOfExperience,
  country,
  province,
  city,
  resumeUrl,
  socialMediaUrl,
  isReferer,
  isReferee,
  slug,
}) => {
  const formSchema = z.object({
    photoUrl: z.any().optional(),
    resumeUrl: z.any().optional(),
    chineseFirstName: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    chineseLastName: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    englishFirstName: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    englishLastName: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    username: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    company: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    jobTitle: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    socialMediaUrl: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    description: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),

    country: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    province: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    city: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    industry: z.string().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    yearOfExperience: z.string(),
    isReferer: z.boolean(),
    isReferee: z.boolean(),
  })

  const [image, setImage] = useState(null)
  const [base64Image, setBase64Image] = useState<string | ArrayBuffer | null>(
    null
  )
  const [resume, setResume] = useState(null)
  const [base64Resume, setBase64Resume] = useState<string | ArrayBuffer | null>(
    null
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const {
    watch,
    setValue,
    formState: { errors },
  } = form

  const { industry: industryList } = useGetIndustryList()
  const { city: cityList } = useGetCityList()
  const { country: countryList } = useGetCountryList()
  const { province: provinceList } = useGetProvinceList()

  const countryWatch = watch("country")
  const provinceWatch = watch("province")
  const industryOptions = useMemo(
    () =>
      industryList.map((industry) => {
        return {
          value: industry.uuid,
          title: `${industry.english_name} | ${industry.cantonese_name}`,
        }
      }),
    [industryList]
  )

  const countryOptions = useMemo(
    () =>
      countryList.map((country) => {
        return {
          value: country.uuid,
          title: `${country.english_name} | ${country.cantonese_name}`,
        }
      }),
    [countryList]
  )

  const provinceOptions = useMemo(() => {
    const res = provinceList.map((province) => {
      if (province.country_uuid === countryWatch) {
        return {
          value: province.uuid,
          title: `${province.english_name} | ${province.cantonese_name}`,
        } as { value: string; title: string }
      }
    })
    return res.filter((r) => r !== undefined)
  }, [countryWatch, provinceList])

  const cityOptions = useMemo(() => {
    const res = cityList.map((city) => {
      if (city.province_uuid === provinceWatch) {
        return {
          value: city.uuid,
          title: `${city.english_name} | ${city.cantonese_name}`,
        } as { value: string; title: string }
      }
    })
    return res.filter((r) => r !== undefined)
  }, [cityList, provinceWatch])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let photoUrl = values.photoUrl

    if (image) {
      const { data, error } = await supabase.storage
        .from("profile_image")
        .upload("test1/avatar1.png", image, {
          cacheControl: "3600",
          upsert: false,
        })

      const { data: imageUrl } = await supabase.storage
        .from("profile_image")
        .getPublicUrl("test1/avatar1.png")

      photoUrl = imageUrl.publicUrl
    }

    if (resume) {
      const { data, error } = await supabase.storage
        .from("resume")
        .upload("test1/avatar1.pdf", resume, {
          cacheControl: "3600",
          upsert: false,
        })

      const { data: pdfUrl } = await supabase.storage
        .from("resume")
        .getPublicUrl("test1/avatar1.pdf")

      resumeUrl = pdfUrl.publicUrl
    }

    console.log("resumeUrl", resumeUrl)

    const { error } = await supabase
      .from("user")
      .update({
        avatar_url: photoUrl,
        chinese_first_name: values.chineseFirstName,
        chinese_last_name: values.chineseLastName,
        english_first_name: values.englishFirstName,
        english_last_name: values.englishLastName,
        username: values.username,
        description: values.description,
        company_name: values.company,
        job_title: values.jobTitle,
        year_of_experience: parseInt(values.yearOfExperience),
        country_uuid: values.country,
        province_uuid: values.province,
        city_uuid: values.city,
        industry_uuid: values.industry,
        resume_url: resumeUrl,
        social_media_url: values.socialMediaUrl,
        is_referer: values.isReferer,
        is_referee: values.isReferee,
      })
      .eq("uuid", slug)
  }

  const handleProfileImageChange = (e: any) => {
    const imageFile = e.target.files[0]

    setImage(imageFile)
    if (imageFile) {
      const reader = new FileReader()

      reader.onload = (e: any) => {
        const base64Image = e.target.result
        setBase64Image(base64Image)
      }

      reader.readAsDataURL(imageFile)
    }
  }

  const handleResumeChange = (e: any) => {
    const pdfFile = e.target.files[0]

    setResume(pdfFile)
    if (pdfFile) {
      const reader = new FileReader()

      reader.onload = (e: any) => {
        const base64Image = e.target.result
        setBase64Resume(base64Image)
      }

      reader.readAsDataURL(pdfFile)
    }
  }

  return (
    <div>
      <Form {...form}>
        {base64Image && (
          <Image src={base64Image} width={200} height={200} alt={username} />
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormCheckBox
            control={form.control}
            label="Is referer"
            name="isReferer"
            description="isReferer"
          />

          <FormCheckBox
            control={form.control}
            label="Is referee"
            name="isReferee"
            description="isReferee"
          />
          <InputFileField
            label="photoUrl"
            accept=".jpg, .jpeg, .png"
            description="photoUrl"
            placeholder="photoUrl"
            onChange={handleProfileImageChange}
          />

          <InputFileField
            label="resume"
            accept=".pdf"
            description="resuem"
            placeholder="resume"
            onChange={handleResumeChange}
          />
          <InputField
            control={form.control}
            label="Chinese First Name"
            name="chineseFirstName"
            description="Enter your Chinese first name"
            placeholder="Chinese First Name"
          />

          <InputField
            control={form.control}
            label="Chinese Last Name"
            name="chineseLastName"
            description="Enter your Chinese last name"
            placeholder="Chinese Last Name"
          />

          <InputField
            control={form.control}
            label="English First Name"
            name="englishFirstName"
            description="Enter your English first name"
            placeholder="English First Name"
          />

          <InputField
            control={form.control}
            label="English Last Name"
            name="englishLastName"
            description="Enter your English last name"
            placeholder="English Last Name"
          />

          <InputField
            control={form.control}
            label="Username"
            name="username"
            description="Enter your username"
            placeholder="Username"
          />

          <FormTextArea
            control={form.control}
            label="Description"
            name="description"
            description="description"
            placeholder="description"
          />

          <InputField
            control={form.control}
            label="Company"
            name="company"
            description="Enter your company name"
            placeholder="Company"
          />

          <InputField
            control={form.control}
            label="Job Title"
            name="jobTitle"
            description="Enter your job title"
            placeholder="Job Title"
          />

          <FormNumberInputField
            control={form.control}
            label="yearOfExperience"
            name="yearOfExperience"
            description="yearOfExperience"
            placeholder="yearOfExperience"
          />

          <FormSelect
            options={industryOptions}
            control={form.control}
            label="industry"
            name="industry"
            description="Select your industry"
            placeholder="Select a industry"
          />
          <FormSelect
            options={countryOptions}
            control={form.control}
            label="Country"
            name="country"
            description="Select your country"
            placeholder="Select a country"
          />
          <FormSelect
            control={form.control}
            label="Province"
            name="province"
            options={provinceOptions}
            description="Select your province"
            placeholder="Select a province"
          />

          <FormSelect
            control={form.control}
            label="City"
            name="city"
            options={cityOptions}
            description="Select your city"
            placeholder="Select a city"
          />
          <InputField
            control={form.control}
            label="Social Media URL"
            name="socialMediaUrl"
            description="Enter your social media URL"
            placeholder="Social Media URL"
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default EditProfileTemplate
