import React, { useEffect, useMemo, useState } from "react"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import { useRouter } from "next/navigation"
import { conditionalValidation } from "@/modules/profile/form/validation.ts/conditional"
import { maximumWordValidation } from "@/modules/profile/form/validation.ts/max-word"
import { nameValidation } from "@/modules/profile/form/validation.ts/name"
import { supabase } from "@/utils/services/supabase/config"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
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
import { useToast } from "@/components/ui/use-toast"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import FormCheckBox from "@/components/customized-ui/form/check-box"
import FormFileUpload from "@/components/customized-ui/form/file"
import FormTextInput from "@/components/customized-ui/form/input"
import FormNumberInput from "@/components/customized-ui/form/number"
import FormSelect from "@/components/customized-ui/form/select"
import FormTextArea from "@/components/customized-ui/form/text-area"
import NumberInput from "@/components/customized-ui/inputs/number"
import { Icons } from "@/components/icons"

interface IEdiProfileTemplate {
  isProfileLoading: boolean
  photoUrl?: string
  username: string | null
  description: string | null
  company: string | null
  jobTitle: string | null
  yearOfExperience?: number | null
  countryUuid: string | null
  provinceUuid: string | null
  industryUuid: string | null
  cityUuid: string | null
  // resumeUrl: string | null
  socialMediaUrl: string | null
  isReferer: boolean
  isReferee: boolean
  setIsEditMode: (value: boolean) => void
}

const EditProfileTemplate: React.FunctionComponent<IEdiProfileTemplate> = ({
  photoUrl,
  username,
  description,
  company,
  jobTitle,
  yearOfExperience,
  countryUuid,
  provinceUuid,
  cityUuid,
  industryUuid,
  socialMediaUrl,
  isReferer,
  isReferee,
  isProfileLoading,
  setIsEditMode,
}) => {
  const formSchema = z
    .object({
      photoUrl: z.any().optional(),
      resumeUrl: z.any().optional(),
      // chineseFirstName: maximumWordValidation(4).optional(),
      // chineseLastName: maximumWordValidation(4).optional(),
      // englishFirstName: maximumWordValidation(30).optional(),
      // englishLastName: maximumWordValidation(30).optional(),
      username: nameValidation(10).min(1, {
        message: `至少有要1粒字`,
      }),
      company: conditionalValidation(30).optional(),
      jobTitle: conditionalValidation(30).optional(),
      socialMediaUrl: maximumWordValidation(250)
        .url({
          message: "無效連結",
        })
        .optional(),
      description: conditionalValidation(3000).optional(),
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
      yearOfExperience: z.string().optional(),
      isReferer: z.boolean(),
      isReferee: z.boolean(),
    })
    .refine((schema) => (schema.isReferer ? schema.company : true), {
      path: ["company"],
      message: "如果想成為推薦人，請填一填",
    })
    .refine((schema) => (schema.isReferer ? schema.jobTitle : true), {
      path: ["jobTitle"],
      message: "如果想成為推薦人，請填一填",
    })
    .refine(
      (schema) =>
        schema.isReferer || schema.isReferee ? schema.description : true,
      {
        path: ["description"],
        message: "如果想成為推薦人/受薦人，請填一填",
      }
    )
    .refine(
      (schema) =>
        schema.isReferer || schema.isReferee ? schema.yearOfExperience : true,
      {
        path: ["yearOfExperience"],
        message: "如果想成為推薦人/受薦人，請填一填",
      }
    )

  const router = useRouter()
  const { toast } = useToast()
  const [image, setImage] = useState<any | null>(null)
  const [base64Image, setBase64Image] = useState<string | StaticImport | null>(
    null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useUserStore((state) => state)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => {
      return {
        username: username || undefined,
        // chineseFirstName: chineseFirstName || undefined,
        // chineseLastName: chineseLastName || undefined,
        // englishFirstName: englishFirstName || undefined,
        // englishLastName: englishLastName || undefined,
        description: description || undefined,
        company: company || undefined,
        jobTitle: jobTitle || undefined,
        yearOfExperience: yearOfExperience?.toString() || "0",
        countryUuid: countryUuid || undefined,
        provinceUuid: provinceUuid || undefined,
        cityUuid: cityUuid || undefined,
        // resumeUrl: resumeUrl || undefined,
        socialMediaUrl: socialMediaUrl || undefined,
        isReferer: isReferer || false,
        isReferee: isReferee || false,
        industryUuid: industryUuid || undefined,
      }
    }, [isProfileLoading]),
  })

  const { watch, setValue } = form

  const countryWatch = watch("countryUuid")
  const provinceWatch = watch("provinceUuid")
  const yeoWatch = watch("yearOfExperience")

  const { industry: industryList } = useGetIndustryList()
  const { country: countryList } = useGetCountryList()
  const { province: provinceList } = useGetProvinceList()
  const { city: cityList } = useGetCityList()

  const industryOptions = useIndustryOptions(industryList)
  const countryOptions = useCountryOptions(countryList)
  const provinceOptions = useProvinceOptions(provinceList, countryWatch)
  const cityOptions = useCityOptions(cityList, provinceWatch)

  useEffect(() => {
    if (provinceWatch !== provinceUuid) {
      setValue("cityUuid", "")
    }
  }, [provinceOptions, provinceWatch])

  useEffect(() => {
    // Convert yeoWatch to a number
    const yeoWatchNumber = yeoWatch ? parseFloat(yeoWatch) : 0

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
    setIsSubmitting(true)
    let photoUrl = values.photoUrl

    if (image) {
      // TODO
      // clean bacuket before insert image
      const uuid = uuidv4()
      const { data, error } = await supabase.storage
        .from("profile_image")
        .upload(`${user.uuid}/${uuid}_${image.name}`, image)

      if (error) {
        return toast({
          title: "上載嘜頭時出錯！",
          description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
        })
      }
      const { data: imageUrl } = await supabase.storage
        .from("profile_image")
        .getPublicUrl(`${user.uuid}/${uuid}_${image.name}`)

      photoUrl = imageUrl.publicUrl
    }

    // TODO
    // Error handling email , username dupliation
    const { error } = await supabase
      .from("user")
      .update({
        avatar_url: photoUrl,
        // chinese_first_name: values.chineseFirstName,
        // chinese_last_name: values.chineseLastName,
        // english_first_name: values.englishFirstName,
        // english_last_name: values.englishLastName,
        username: values.username,
        description: values.description,
        company_name: values.company,
        job_title: values.jobTitle,
        year_of_experience: values.yearOfExperience
          ? parseInt(values.yearOfExperience)
          : "0",
        country_uuid: values.countryUuid,
        province_uuid: values.provinceUuid,
        city_uuid: values.cityUuid,
        industry_uuid: values.industryUuid,
        // resume_url: resumeUrl,
        social_media_url: values.socialMediaUrl,
        is_referer: values.isReferer,
        is_referee: values.isReferee,
      })
      .eq("uuid", user.uuid)

    if (error) {
      return toast({
        title: "出事！",
        description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
      })
    }

    router.push("/")
    setIsSubmitting(false)
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

  return (
    <div className="w-full h-full flex flex-col mt-28 p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setIsEditMode(false)
              }}
              variant={"ghost"}
            >
              <Icons.undo />
            </Button>
          </div>

          <div className="flex justify-center">
            {photoUrl && !base64Image && (
              <BaseAvatar
                url={photoUrl}
                alt={username}
                fallBack={username && username[0]}
                size="large"
              />
            )}

            {base64Image && (
              <BaseAvatar
                url={base64Image.toString()}
                alt={username}
                fallBack={username && username[0]}
                size="large"
              />
            )}
          </div>

          <FormFileUpload
            label="你嘅嘜頭"
            accept=".jpg, .jpeg, .png"
            onChange={handleProfileImageChange}
          />

          <div className="flex   flex-col sm:flex-row gap-4 w-full justify-center items-center mt-4">
            <div className="w-full">
              <FormCheckBox
                control={form.control}
                label="推薦人"
                name="isReferer"
                description="你嘅資料會俾公開（Email不會)，如果有人想入你間公司，就會搵你幫手🙏🏻"
              />
            </div>

            <div className="w-full">
              <FormCheckBox
                control={form.control}
                label="受薦人"
                name="isReferee"
                description="你嘅資料會俾公開（Email不會)，如果有人想招你入佢間公司，就會搵你，祝一切順利！"
              />
            </div>
          </div>

          <FormTextInput
            control={form.control}
            label="使用者名稱"
            name="username"
          />

          <FormTextArea
            control={form.control}
            label="個人簡介"
            name="description"
            description="可以簡介吓你嘅經歷，你當簡單版Resume。"
          />

          <FormTextInput control={form.control} label="公司名" name="company" />

          <FormTextInput
            control={form.control}
            label="職位名/工作名稱"
            name="jobTitle"
            description="呢度寫翻你個Title，如果搵工就寫翻自己想搵乜工，方便人Search到你。"
          />

          <FormNumberInput
            control={form.control}
            label="工作年資"
            name="yearOfExperience"
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
          <FormTextInput
            control={form.control}
            label="個人連結"
            name="socialMediaUrl"
            description="可以放你LinkedIn/個人網站/Portfolio。"
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "請等等" : "提交"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default EditProfileTemplate
