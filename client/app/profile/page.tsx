"use client"

import React, {  useState } from "react"
import { Icons } from "@/components/icons"
import useUserStore from "@/hooks/state/user/useUserStore"
import EditProfileTemplate from "@/modules/profile/edit/template"
import ViewProfileTemplate from "@/modules/profile/view/template"
import useGetUserprofile from "@/hooks/api/user/useGetUserprofile"
import Link from "next/link"
import { siteConfig } from "@/config/site"

const Page = ({ params }: { params: { slug: string } }) => {
  const userUuid = useUserStore((state) => state.uuid)
  const [isEditMode, setIsEditMode] = useState(false)
  const {data:profile, isLoading, isError}=useGetUserprofile(userUuid)


  if (!isLoading && profile===null)
    return (
      <div className="flex flex-col  justify-center items-center rounded-lg p-4 gap-4  h-screen">
      <span className="text-5xl">🥲</span>
      <h6>搵唔到用戶資料請refresh網頁或先<Link href={siteConfig.page.auth.href} className="border-b-2 border-green-700 text-green-700 dark:border-yellow-300 dark:text-yellow-300 "> 登入</Link></h6>

    </div>
    )

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen ">
        <Icons.loader className="animate-spin text-2xl" />
      </div>
    )
  if (!isLoading && profile)
    return (
      <div className="h-full w-full mt-8 ">
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
          />
        )}
      </div>
    )
}

export default Page
