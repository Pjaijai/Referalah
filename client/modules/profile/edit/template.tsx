"use client"

import React, { useEffect, useMemo, useState } from "react"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import { conditionalValidation } from "@/modules/profile/form/validation.ts/conditional"
import { maximumWordValidation } from "@/modules/profile/form/validation.ts/max-word"
import { nameValidation } from "@/modules/profile/form/validation.ts/name"
import { supabase } from "@/utils/services/supabase/config"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { IUpdateUserProfileRequest } from "@/types/api/request/user/update"
import useUpdateUserProfile from "@/hooks/api/user/update-user-profile"
import useCityOptions from "@/hooks/common/options/city-options"
import useCountryOptions from "@/hooks/common/options/country-options"
import useIndustryOptions from "@/hooks/common/options/industry-options"
import useProvinceOptions from "@/hooks/common/options/province-options"
import useUserStore from "@/hooks/state/user/store"
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
  refetchProfile: () => void
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
  refetchProfile,
}) => {
  const formSchema = z
    .object({
      photoUrl: z.any().optional(),
      resumeUrl: z.any().optional(),
      username: nameValidation(20).min(1, {
        message: `至少有要1粒字`,
      }),
      company: conditionalValidation(30).optional(),
      jobTitle: conditionalValidation(30).optional(),
      socialMediaUrl: maximumWordValidation(20000)
        .url({
          message: "無效連結",
        })
        .optional()
        .or(z.literal("")),
      description: conditionalValidation(3000).optional(),
      countryUuid: z.string().min(1, {
        message: `幫手填下🙏🏻`,
      }),
      provinceUuid: z.string().min(1, {
        message: `幫手填下🙏🏻`,
      }),
      cityUuid: z.string().min(1, {
        message: `幫手填下🙏🏻`,
      }),
      industryUuid: z.string().min(1, {
        message: `幫手填下🙏🏻`,
      }),
      yearOfExperience: z
        .string()
        .optional()
        .refine(
          (value) => {
            if (value) {
              const number = parseFloat(value)
              return !isNaN(number) && number >= 0 && number <= 100
            }

            return true
            // Check if it's a valid number and falls within the range 1 to 100
          },
          {
            message: "必須喺0到100之間，如果唔夠用請聯絡我🙇🏻‍♂️", // Specify the custom error message here
          }
        ),
      isReferer: z.boolean(),
      isReferee: z.boolean(),
    })
    .refine((schema) => (schema.isReferer ? schema.company : true), {
      path: ["company"],
      message: "如果想成為推薦人，請填一填",
    })
    .refine(
      (schema) =>
        schema.isReferer || schema.isReferee ? schema.jobTitle : true,
      {
        path: ["jobTitle"],
        message: "如果想成為推薦人/受薦人，請填一填",
      }
    )
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

  const { toast } = useToast()
  const [image, setImage] = useState<any | null>(null)
  const [base64Image, setBase64Image] = useState<string | StaticImport | null>(
    null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useUserStore((state) => state)
  const { mutate: updateProfile, error: updateProfileError } =
    useUpdateUserProfile()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => {
      return {
        username: username || undefined,
        description: description || undefined,
        company: company || undefined,
        jobTitle: jobTitle || undefined,
        yearOfExperience: yearOfExperience?.toString() || "0",
        countryUuid: countryUuid || undefined,
        provinceUuid: provinceUuid || undefined,
        cityUuid: cityUuid || undefined,
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
  const yearOfExperienceWatch = watch("yearOfExperience")

  const industryOptions = useIndustryOptions()
  const countryOptions = useCountryOptions()
  const provinceOptions = useProvinceOptions(countryWatch)
  const cityOptions = useCityOptions(provinceWatch)

  useEffect(() => {
    if (provinceWatch !== provinceUuid) {
      setValue("cityUuid", "")
    }
  }, [provinceOptions, provinceWatch])

  useEffect(() => {
    // Convert yearOfExperienceWatch to a number
    const yearOfExperienceWatchNumber = yearOfExperienceWatch
      ? parseFloat(yearOfExperienceWatch)
      : 0

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
      setIsSubmitting(true)
      let photoUrl = values.photoUrl

      if (image) {
        const { data: list, error: listError } = await supabase.storage
          .from("user_assets")
          .list(`${user.uuid}/avatar_image`)

        if (list) {
          const filesToRemove = list.map(
            (x) => `${user.uuid}/avatar_image/${x.name}`
          )

          const { error: removeError } = await supabase.storage
            .from("user_assets")
            .remove(filesToRemove)
        }

        const uuid = uuidv4()
        const { data, error } = await supabase.storage
          .from("user_assets")
          .upload(`${user.uuid}/avatar_image/${uuid}_${image.name}`, image)

        if (error) {
          return toast({
            title: "上載嘜頭時出錯！",
            description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
          })
        }
        const { data: imageUrl } = await supabase.storage
          .from("user_assets")
          .getPublicUrl(`${user.uuid}/avatar_image/${uuid}_${image.name}`)

        photoUrl = imageUrl.publicUrl
      }

      const updateUserRequest: IUpdateUserProfileRequest = {
        avatarUrl: photoUrl,
        username: values.username.trim(),
        description: values.description?.trim(),
        companyName: values.company?.trim(),
        jobTitle: values.jobTitle?.trim(),
        yearOfExperience: values.yearOfExperience
          ? parseInt(values.yearOfExperience)
          : undefined,
        countryUuid: values.countryUuid,
        provinceUuid: values.provinceUuid,
        cityUuid: values.cityUuid,
        industryUuid: values.industryUuid,
        socialMediaUrl: values.socialMediaUrl?.trim(),
        isReferer: values.isReferer,
        isReferee: values.isReferee,
        userUuid: user.uuid!,
      }
      updateProfile(updateUserRequest, {
        onSuccess: () => {
          toast({
            title: "個人檔案更改成功!",
          })
          setIsEditMode(false)
          refetchProfile()
        },
        onSettled: () => {
          setIsSubmitting(false)
        },
        onError: () => {
          return toast({
            title: "出事！",
            description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
            variant: "destructive",
          })
        },
      })
    } catch (err) {
      return toast({
        title: "出事！",
        description: "好似有啲錯誤，如果試多幾次都係咁，請聯絡我🙏🏻",
      })
    }
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
    <div className="flex h-full w-full flex-col p-4">
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
              className=" gap-2"
            >
              <Icons.undo />
              返回
            </Button>
          </div>

          <div className="flex justify-center">
            {!base64Image && (
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
            description="食到JPG，JPEG，PNG，最多1MB。"
          />

          <div className="mt-4   flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="w-full">
              <FormCheckBox
                control={form.control}
                label="推薦人"
                name="isReferer"
                description="你嘅資料會被公開（Email不會)，如果有人想入你間公司，就可以搵你幫手🙏🏻"
              />
            </div>

            <div className="w-full">
              <FormCheckBox
                control={form.control}
                label="受薦人"
                name="isReferee"
                description="你嘅資料會被公開（Email不會)，如果有人想招你入佢間公司，就可以搵你，祝一切順利！"
              />
            </div>
          </div>

          <FormTextInput
            control={form.control}
            label="用戶名稱"
            name="username"
          />

          <FormTextArea
            control={form.control}
            label="個人簡介"
            name="description"
            description="可以簡介吓你嘅經歷，你當簡單版Resume。"
          />

          <FormTextInput
            control={form.control}
            label="公司名(選填)"
            name="company"
          />

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
            options={provinceOptions}
          />

          <FormSelect
            control={form.control}
            label="城市"
            name="cityUuid"
            options={cityOptions}
          />
          <FormTextInput
            control={form.control}
            label="個人連結(選填)"
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
