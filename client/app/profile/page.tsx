"use client"

import React, {  useState } from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/icons"
import useUserStore from "@/hooks/state/user/useUserStore"
import EditProfileTemplate from "@/modules/profile/edit/template"
import ViewProfileTemplate from "@/modules/profile/view/template"
import useGetUserprofile from "@/hooks/api/user/useGetUserprofile"

const Page = ({ params }: { params: { slug: string } }) => {
  const userUuid = useUserStore((state) => state.uuid)
  const [isEditMode, setIsEditMode] = useState(false)
  const {data:profile, isLoading, isError}=useGetUserprofile(userUuid)

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
            // chineseFirstName={profile.chinese_first_name}
            // chineseLastName={profile.chinese_last_name}
            // englishFirstName={profile.english_first_name}
            // englishLastName={profile.english_last_name}
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
            // resumeUrl={profile.resume_url}
            // industryList={industryList}
            // cityList={cityList}
            // countryList={countryList}
            // provinceList={provinceList}
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
            // resumeUrl={profile.resume_url}
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
