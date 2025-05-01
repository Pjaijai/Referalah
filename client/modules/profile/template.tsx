"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import ViewProfileTemplate from "@/modules/profile/view/template"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import { ELocale } from "@/types/common/enums/locale"
import { siteConfig } from "@/config/site"
import useGetUserprofile from "@/hooks/api/user/get-user-profile"
import useUserStore from "@/hooks/state/user/store"
import { Icons } from "@/components/icons"

interface IProfileTemplateProps {
  userUuid?: string
}

const ProfileTemplate: React.FunctionComponent<IProfileTemplateProps> = (
  props
) => {
  const { userUuid } = props
  const t = useI18n()
  const locale = useCurrentLocale()
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
      <ViewProfileTemplate
        photoUrl={profile.avatar_url || undefined}
        username={profile.username}
        description={profile.description}
        company={profile.company_name}
        jobTitle={profile.job_title}
        yearOfExperience={profile.year_of_experience}
        socialLinks={profile.links}
        isReferee={profile.is_referee}
        isReferer={profile.is_referer}
        slug={userUuid}
        province={
          locale === ELocale.ZH_HK
            ? profile.province && profile.province.cantonese_name
            : profile.province && profile.province.english_name
        }
        country={
          locale === ELocale.ZH_HK
            ? profile.country && profile.country.cantonese_name
            : profile.country && profile.country.english_name
        }
        city={
          locale === ELocale.ZH_HK
            ? profile.city && profile.city.cantonese_name
            : profile.city && profile.city.english_name
        }
        industry={
          locale === ELocale.ZH_HK
            ? profile.industry && profile.industry.cantonese_name
            : profile.industry && profile.industry.english_name
        }
        requestCount={profile.contact_request_count}
        postCount={profile.post_count[0].count}
      />
    )

  return <></>
}

export default ProfileTemplate
