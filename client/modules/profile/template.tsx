"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import EditProfileTemplate from "@/modules/profile/edit/template"
import ViewProfileTemplate from "@/modules/profile/view/template"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { siteConfig } from "@/config/site"
import useGetUserprofile from "@/hooks/api/user/get-user-profile"
import useUserStore from "@/hooks/state/user/store"
import { Icons } from "@/components/icons"
import CommonPageLayout from "@/components/layouts/common"

interface IProfileTemplateProps {
  userUuid?: string
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  cityList: ICityResponse[]
  industryList: IIndustryResponse[]
}

const ProfileTemplate: React.FunctionComponent<IProfileTemplateProps> = (
  props
) => {
  const { cityList, countryList, industryList, provinceList, userUuid } = props
  const t = useI18n()
  const locale = useCurrentLocale()
  const [isEditMode, setIsEditMode] = useState(false)
  const userStoreUuid = useUserStore((state) => state.uuid)
  const uuid = useMemo(() => {
    if (userUuid) {
      return userUuid
    } else if (userStoreUuid) {
      return userStoreUuid
    } else {
      return null
    }
  }, [userStoreUuid, userUuid])

  const { data: profile, isLoading } = useGetUserprofile(uuid)

  if (!userUuid || (!isLoading && !profile))
    return (
      <div className="flex h-screen  flex-col items-center justify-center gap-4 rounded-lg  p-4">
        <span className="text-5xl">🥲</span>
        <h6>
          {t("profile.con_not_find_user")}
          <Link
            href={siteConfig.page.signIn.href}
            className="border-b-2 border-green-700 text-green-700 dark:border-yellow-300 dark:text-yellow-300 "
          >
            {t("general.sign_in")}
          </Link>
        </h6>
      </div>
    )

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center ">
        <Icons.loader className="animate-spin text-2xl" />
      </div>
    )
  if (!isLoading && profile)
    return (
      <CommonPageLayout title={t("page.profile")}>
        {!isEditMode && (
          <ViewProfileTemplate
            photoUrl={profile.avatar_url || undefined}
            username={profile.username}
            description={profile.description}
            company={profile.company_name}
            jobTitle={profile.job_title}
            yearOfExperience={profile.year_of_experience}
            socialMediaUrl={profile.social_media_url}
            isReferee={profile.is_referee}
            isReferer={profile.is_referer}
            setIsEditMode={setIsEditMode}
            slug={userUuid}
            province={
              locale === "zh-hk"
                ? profile.province && profile.province.cantonese_name
                : profile.province && profile.province.english_name
            }
            country={
              locale === "zh-hk"
                ? profile.country && profile.country.cantonese_name
                : profile.country && profile.country.english_name
            }
            city={
              locale === "zh-hk"
                ? profile.city && profile.city.cantonese_name
                : profile.city && profile.city.english_name
            }
            industry={
              locale === "zh-hk"
                ? profile.industry && profile.industry.cantonese_name
                : profile.industry && profile.industry.english_name
            }
          />
        )}

        {isEditMode && (
          <EditProfileTemplate
            photoUrl={profile.avatar_url || undefined}
            username={profile.username}
            description={profile.description}
            company={profile.company_name}
            jobTitle={profile.job_title}
            yearOfExperience={profile.year_of_experience}
            countryUuid={profile.country && profile.country.uuid}
            provinceUuid={profile.province && profile.province.uuid}
            cityUuid={profile.city && profile.city.uuid}
            industryUuid={profile.industry && profile.industry.uuid}
            socialMediaUrl={profile.social_media_url}
            isReferee={profile.is_referee}
            isReferer={profile.is_referer}
            isProfileLoading={isLoading}
            setIsEditMode={setIsEditMode}
            countryList={countryList}
            provinceList={provinceList}
            cityList={cityList}
            industryList={industryList}
          />
        )}
      </CommonPageLayout>
    )

  return <></>
}

export default ProfileTemplate
