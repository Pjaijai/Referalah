"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import EditProfileTemplate from "@/modules/profile/edit/template"
import ViewProfileTemplate from "@/modules/profile/view/template"
import { useI18n } from "@/utils/services/internationalization/client"

import { siteConfig } from "@/config/site"
import useGetUserprofile from "@/hooks/api/user/get-user-profile"
import useUserStore from "@/hooks/state/user/store"
import { Icons } from "@/components/icons"
import CommonPageLayout from "@/components/layouts/common"

const ProfileTemplate = ({ userUuid }: { userUuid?: string }) => {
  const t = useI18n()
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

  const { data: profile, isLoading, refetch } = useGetUserprofile(uuid)

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
      <CommonPageLayout title={siteConfig.page.profile.name}>
        {!isEditMode && (
          <ViewProfileTemplate
            photoUrl={profile.avatar_url || undefined}
            username={profile.username}
            description={profile.description}
            company={profile.company_name}
            jobTitle={profile.job_title}
            yearOfExperience={profile.year_of_experience}
            country={profile.country && profile.country.cantonese_name}
            province={profile.province && profile.province.cantonese_name}
            city={profile.city && profile.city.cantonese_name}
            industry={profile.industry && profile.industry.cantonese_name}
            socialMediaUrl={profile.social_media_url}
            isReferee={profile.is_referee}
            isReferer={profile.is_referer}
            setIsEditMode={setIsEditMode}
            slug={userUuid}
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
            refetchProfile={refetch}
          />
        )}
      </CommonPageLayout>
    )

  return <></>
}

export default ProfileTemplate
