import React, { useEffect, useMemo, useState } from "react"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import Image from "next/image"
import FormCheckBox from "@/modules/profile/form/fields/checkbox"
import InputFileField from "@/modules/profile/form/fields/file"
import InputField from "@/modules/profile/form/fields/input"
import FormNumberInputField from "@/modules/profile/form/fields/number"
import FormSelect from "@/modules/profile/form/fields/select"
import FormTextArea from "@/modules/profile/form/fields/textArea"
import { conditionalValidation } from "@/modules/profile/form/validation.ts/conditional"
import { maximumWordValidation } from "@/modules/profile/form/validation.ts/max-word"
import { nameValidation } from "@/modules/profile/form/validation.ts/name"
import { IViewProfileTemplateProps } from "@/modules/profile/view/template"
import { supabase } from "@/utils/services/supabase/config"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import useCityOptions from "@/hooks/common/options/useCityOptions"
import useCountryOptions from "@/hooks/common/options/useCountryOptions"
import useIndustryOptions from "@/hooks/common/options/useIndustryOptions"
import useProvinceOptions from "@/hooks/common/options/useProvinceOptions"
import useUserStore from "@/hooks/state/user/useUserStore"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

interface IEdiProfileTemplate extends IViewProfileTemplateProps {
  isProfileLoading: boolean
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
  countryUuid,
  provinceUuid,
  cityUuid,
  resumeUrl,
  industryUuid,
  socialMediaUrl,
  isReferer,
  isReferee,
  industryList,
  countryList,
  provinceList,
  cityList,
  isProfileLoading,
  setIsEditMode,
}) => {
  const formSchema = z
    .object({
      photoUrl: z.any().optional(),
      resumeUrl: z.any().optional(),
      chineseFirstName: maximumWordValidation(4).optional(),
      chineseLastName: maximumWordValidation(4).optional(),
      englishFirstName: maximumWordValidation(30).optional(),
      englishLastName: maximumWordValidation(30).optional(),
      username: nameValidation(10).min(1, {
        message: `至少有要1粒字`,
      }),
      company: conditionalValidation(30).optional(),
      jobTitle: conditionalValidation(30).optional(),
      socialMediaUrl: maximumWordValidation(250).optional(),
      description: conditionalValidation(3000).optional(),
      countryUuid: z.string().optional(),
      provinceUuid: z.string().optional(),
      cityUuid: z.string().optional(),
      industryUuid: z.string().optional(),
      yearOfExperience: z.string().optional(),
      isReferer: z.boolean(),
      isReferee: z.boolean(),
    })
    .refine(
      (schema) =>
        schema.isReferer || schema.isReferee ? schema.company : true,
      {
        path: ["company"],
        message: "如果想成為推薦人/被推薦人，請填一填",
      }
    )
    .refine(
      (schema) =>
        schema.isReferer || schema.isReferee ? schema.jobTitle : true,
      {
        path: ["jobTitle"],
        message: "如果想成為推薦人/被推薦人，請填一填",
      }
    )
    .refine(
      (schema) =>
        schema.isReferer || schema.isReferee ? schema.description : true,
      {
        path: ["description"],
        message: "如果想成為推薦人/被推薦人，請填一填",
      }
    )
    .refine(
      (schema) =>
        schema.isReferer || schema.isReferee ? schema.yearOfExperience : true,
      {
        path: ["yearOfExperience"],
        message: "如果想成為推薦人/被推薦人，請填一填",
      }
    )
    .refine(
      (schema) =>
        schema.isReferer || schema.isReferee ? schema.countryUuid : true,
      {
        path: ["countryUuid"],
        message: "如果想成為推薦人/被推薦人，請填一填",
      }
    )

  const [image, setImage] = useState<any | null>(null)
  const [base64Image, setBase64Image] = useState<string | StaticImport | null>(
    null
  )
  const [resume, setResume] = useState<any | null>(null)
  const [base64Resume, setBase64Resume] = useState<string | ArrayBuffer | null>(
    null
  )
  const user = useUserStore((state) => state)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => {
      return {
        username: username || undefined,
        chineseFirstName: chineseFirstName || undefined,
        chineseLastName: chineseLastName || undefined,
        englishFirstName: englishFirstName || undefined,
        englishLastName: englishLastName || undefined,
        description: description || undefined,
        company: company || undefined,
        jobTitle: jobTitle || undefined,
        yearOfExperience: yearOfExperience?.toString() || undefined,
        countryUuid: countryUuid || undefined,
        provinceUuid: provinceUuid || undefined,
        cityUuid: cityUuid || undefined,
        resumeUrl: resumeUrl || undefined,
        socialMediaUrl: socialMediaUrl || undefined,
        isReferer: isReferer || undefined,
        isReferee: isReferee || undefined,
        industryUuid: industryUuid || undefined,
      }
    }, [isProfileLoading]),
  })

  const {
    watch,
    formState: { errors },
  } = form

  const countryWatch = watch("countryUuid")
  const provinceWatch = watch("provinceUuid")

  const industryOptions = useIndustryOptions(industryList)
  const countryOptions = useCountryOptions(countryList)
  const provinceOptions = useProvinceOptions(provinceList, countryWatch)
  const cityOptions = useCityOptions(cityList, provinceWatch)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let photoUrl = values.photoUrl

    if (image) {
      // TODO
      // clean bacuket before insert image
      const uuid = uuidv4()
      const { data, error } = await supabase.storage
        .from("profile_image")
        .upload(`${user.uuid}/${uuid}_${image.name}`, image, {
          cacheControl: "3600",
          upsert: false,
        })

      const { data: imageUrl } = await supabase.storage
        .from("profile_image")
        .getPublicUrl(`${user.uuid}/${uuid}_${image.name}`)

      photoUrl = imageUrl.publicUrl
    }

    if (resume) {
      const uuid = uuidv4()
      const { data, error } = await supabase.storage
        .from("resume")
        .upload(`${user.uuid}/${uuid}_${resume.name}`, resume, {
          cacheControl: "3600",
          upsert: false,
        })

      const { data: pdfUrl } = await supabase.storage
        .from("resume")
        .getPublicUrl(`${user.uuid}/${uuid}_${resume.name}`)

      resumeUrl = pdfUrl.publicUrl
    }

    // TODO
    // Error handling email , username dupliation
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
        year_of_experience: values.yearOfExperience
          ? parseInt(values.yearOfExperience)
          : null,
        country_uuid: values.countryUuid,
        province_uuid: values.provinceUuid,
        city_uuid: values.cityUuid,
        industry_uuid: values.industryUuid,
        resume_url: resumeUrl,
        social_media_url: values.socialMediaUrl,
        is_referer: values.isReferer,
        is_referee: values.isReferee,
      })
      .eq("uuid", user.uuid)
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
        <Button
          onClick={() => {
            setIsEditMode(false)
          }}
        >
          back
        </Button>
        {photoUrl && !base64Image && (
          <Image src={photoUrl} width={200} height={200} alt={username ?? ""} />
        )}

        {base64Image && (
          <Image
            src={base64Image}
            width={200}
            height={200}
            alt={username ?? ""}
          />
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
