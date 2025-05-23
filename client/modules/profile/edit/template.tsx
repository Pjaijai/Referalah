"use client"

import React, { useEffect, useMemo, useState } from "react"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import { useRouter } from "next/navigation"
import BasicInfoSection from "@/modules/profile/components/sections/basic-info/basic-info"
import NotificationPermissionSection from "@/modules/profile/components/sections/notification-permission/notification-permission"
import SocialLinksSection from "@/modules/profile/components/sections/social-links/social-links"
import WorkExperienceSection from "@/modules/profile/components/sections/work-experience/work-experience"
import { useI18n } from "@/utils/services/internationalization/client"
import { supabase } from "@/utils/services/supabase/config"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { IUpdateUserProfileRequest } from "@/types/api/request/user/update"
import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { EQueryKeyString } from "@/types/common/query-key-string"
import { ESocialLink, socialLinkValues } from "@/types/common/social-links"
import { siteConfig } from "@/config/site"
import useGetUserprofile from "@/hooks/api/user/get-user-profile"
import useUpdateUserProfile from "@/hooks/api/user/update-user-profile"
import useCountryOptions from "@/hooks/common/options/country-options"
import useProvinceOptions from "@/hooks/common/options/province-options"
import useUserStore from "@/hooks/state/user/store"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

interface IEdiProfileTemplate {
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  industryList: IIndustryResponse[]
}

const EditProfileTemplate: React.FunctionComponent<IEdiProfileTemplate> = ({
  countryList,
  provinceList,
  cityList,
  industryList,
}) => {
  const userUuid = useUserStore((state) => state.uuid)
  const t = useI18n()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: profile, isLoading: isProfileLoading } =
    useGetUserprofile(userUuid)

  const linkSchema = z.object({
    url: z
      .string()
      .trim()
      .max(20000, {
        message: t("validation.text.maximum_length", { count: 20000 }),
      })
      .url({
        message: t("validation.link.not_valid"),
      }),

    type: z.enum(socialLinkValues),
    name: z
      .string()
      .max(100, {
        message: t("validation.text.maximum_length", { count: 100 }),
      })
      .trim()
      .transform((val) => (val === "" ? null : val))
      .nullable()
      .optional(),
  })

  const formSchema = z
    .object({
      photoUrl: z.any().optional(),
      resumeUrl: z.any().optional(),
      username: z
        .string()
        .max(20, {
          message: t("validation.text.maximum_length", { count: 20 }),
        })
        .min(1, {
          message: t("validation.text.minimum_length", { count: 1 }),
        })
        .refine((value) => !/\s/.test(value), {
          message: t("validation.text.no_white_space"),
        }),
      company: z
        .string()
        .max(30, {
          message: t("validation.text.maximum_length", { count: 30 }),
        })
        .optional(),
      jobTitle: z
        .string()
        .max(30, {
          message: t("validation.text.maximum_length", { count: 30 }),
        })
        .optional(),
      socialMediaUrl: z
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
        .optional(),
      countryUuid: z.string().min(1, {
        message: t("validation.field_required"),
      }),
      provinceUuid: z.string().optional(),
      cityUuid: z.string().optional(),
      industryUuid: z.string().min(1, {
        message: t("validation.field_required"),
      }),
      links: z.array(linkSchema).max(5),
      notificationPermissions: z.array(z.string()),
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
            message: t("validation.year_of_experience.exceed_range"), // Specify the custom error message here
          }
        ),
      isReferer: z.boolean(),
      isReferee: z.boolean(),
    })
    .refine((schema) => (schema.isReferer ? schema.company : true), {
      path: ["company"],
      message: t("profile.is_referrer.required"),
    })
    .refine(
      (schema) =>
        schema.isReferer || schema.isReferee ? schema.jobTitle : true,
      {
        path: ["jobTitle"],
        message: t("profile.is_referrer_or_referee.required"),
      }
    )
    .refine(
      (schema) =>
        schema.isReferer || schema.isReferee ? schema.description : true,
      {
        path: ["description"],
        message: t("profile.is_referrer_or_referee.required"),
      }
    )
    .refine(
      (schema) =>
        schema.isReferer || schema.isReferee ? schema.yearOfExperience : true,
      {
        path: ["yearOfExperience"],
        message: t("profile.is_referrer_or_referee.required"),
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
      const res = {
        username: profile?.username || undefined,
        description: profile?.description || undefined,
        company: profile?.company_name || undefined,
        jobTitle: profile?.job_title || undefined,
        yearOfExperience: profile?.year_of_experience?.toString() || "0",
        countryUuid: profile?.country?.uuid || undefined,
        provinceUuid: profile?.province?.uuid || undefined,
        cityUuid: profile?.city?.uuid || undefined,
        socialMediaUrl: profile?.social_media_url || undefined,
        isReferer: profile?.is_referer || false,
        isReferee: profile?.is_referee || false,
        industryUuid: profile?.industry?.uuid || undefined,
        links: profile?.links || [],
        notificationPermissions: profile?.notification_permissions || [],
      }

      return res
    }, [profile, profile?.links]),
  })

  const { watch, setValue, reset, control } = form

  useEffect(() => {
    if (profile) {
      const {
        city,
        company_name,
        country,
        description,
        industry,
        is_referee,
        is_referer,
        job_title,
        username,
        year_of_experience,
        province,
        social_media_url,
      } = profile

      reset({
        username: username || undefined,
        description: description || undefined,
        company: company_name || undefined,
        jobTitle: job_title || undefined,
        yearOfExperience: year_of_experience?.toString() || "0",
        countryUuid: country?.uuid || undefined,
        provinceUuid: province?.uuid || undefined,
        cityUuid: city?.uuid || undefined,
        socialMediaUrl: social_media_url || undefined,
        isReferer: is_referer || false,
        isReferee: is_referee || false,
        industryUuid: industry?.uuid || undefined,
        links: profile?.links || [],
        notificationPermissions: profile?.notification_permissions || [],
      })
    }
  }, [profile, isProfileLoading, reset])

  const countryWatch = watch("countryUuid")
  const provinceWatch = watch("provinceUuid")
  const yearOfExperienceWatch = watch("yearOfExperience")

  const isReferrerWatch = watch("isReferer")
  const isRefereeWatch = watch("isReferee")

  const countryOptions = useCountryOptions(countryList)
  const provinceOptions = useProvinceOptions(provinceList, countryWatch)

  useEffect(() => {
    if (profile && countryWatch !== profile.country?.uuid) {
      setValue("provinceUuid", "")
      setValue("cityUuid", "")
    }
  }, [countryOptions, countryWatch, setValue])

  useEffect(() => {
    if (profile && provinceWatch !== profile.province?.uuid) {
      setValue("cityUuid", "")
    }
  }, [provinceOptions, provinceWatch, setValue])

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
  }, [yearOfExperienceWatch, form])

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
          setIsSubmitting(false)
          return toast({
            title: t("profile.avatar_create_failed"),
            description: t("general.error.description"),
          })
        }
        const { data: imageUrl } = await supabase.storage
          .from("user_assets")
          .getPublicUrl(`${user.uuid}/avatar_image/${uuid}_${image.name}`)

        photoUrl = imageUrl.publicUrl
      }

      const mappedLinks = values.links.map((data) => {
        const trimmedName = data.name ? data.name.trim() : null
        return {
          ...data,
          name: data.type === ESocialLink.CUSTOM ? trimmedName || null : null,
        }
      })

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
        provinceUuid: values?.provinceUuid?.length ? values.provinceUuid : null,
        cityUuid: values?.cityUuid?.length ? values.cityUuid : null,
        industryUuid: values.industryUuid,
        links: mappedLinks,
        isReferer: values.isReferer,
        isReferee: values.isReferee,
        userUuid: user.uuid!,
        notificationPermissions: values.notificationPermissions,
      }

      updateProfile(updateUserRequest, {
        onSuccess: () => {
          toast({
            title: t("profile.edit.success"),
          })

          queryClient.invalidateQueries({
            queryKey: [EQueryKeyString.USER_PROFILE, { userUuid: user.uuid }],
          })

          router.push(`${siteConfig.page.profile.href}/${userUuid}`)
        },
        onSettled: () => {
          setIsSubmitting(false)
        },
        onError: () => {
          return toast({
            title: t("general.error.title"),
            description: t("general.error.description"),
            variant: "destructive",
          })
        },
      })
    } catch (err) {
      return toast({
        title: t("general.error.title"),
        description: t("general.error.description"),
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

  if (!profile) return null
  return (
    <div className="relative mt-4  flex h-full w-full flex-col py-4 md:mt-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-12"
        >
          <BasicInfoSection
            base64Image={base64Image}
            form={form}
            onProfileImageChange={handleProfileImageChange}
            profile={profile}
            cityList={cityList}
            provinceList={provinceList}
            countryList={countryList}
            countryWatchValue={countryWatch}
            provinceWatchValue={provinceWatch}
            isReferrerChecked={isReferrerWatch}
            isRefereeChecked={isRefereeWatch}
          />

          <WorkExperienceSection form={form} industryList={industryList} />

          <SocialLinksSection control={control} name={"links"} />

          <NotificationPermissionSection />
          <div className="flex  items-center justify-center md:justify-end ">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full gap-2 md:max-w-sm"
              size={"lg"}
              variant={"theme"}
            >
              {isSubmitting ? t("general.wait") : t("form.general.save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditProfileTemplate
