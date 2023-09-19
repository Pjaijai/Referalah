"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/icons"
import useUserStore from "@/hooks/state/user/useUserStore"
import EditProfileTemplate from "@/modules/profile/edit/template"
import ViewProfileTemplate from "@/modules/profile/view/template"
import { supabase } from "@/utils/services/supabase/config"

const Page = ({ params }: { params: { slug: string } }) => {
  const isUserSignIn = useUserStore((state) => state.isSignIn)
  const userUuid = useUserStore((state) => state.uuid)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [profile, setProfile] = useState<IUserResponse | null>()
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    // Introduce a 1-second delay
    const delay = 1000 // 1000 milliseconds = 1 second
    const timer = setTimeout(() => {
      // After the delay, check if the user is signed in

      if (isUserSignIn === false && isLoading === false) {
        router.back()
        return
      }

      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("user")
          .select(
            `
              uuid,
              email,
              username,
              avatar_url,
              description,
              company_name,
              job_title,
              year_of_experience,
            social_media_url,
          country(
            uuid,
            cantonese_name
        ),
        province(
          uuid,
            cantonese_name
        ),
        city(
          uuid,
            cantonese_name
        ),
        industry(
          uuid,
            cantonese_name
        ),
        is_referer,
        is_referee
        `
          )
          .eq("uuid", userUuid)
          .single()

        if (error) {
          // Handle the error, e.g., show an error message or redirect

          console.error("Error fetching user:", error)
          return
        }

        if (data) {
          setProfile(data as any)
        }
        setIsLoading(false)
      }

      if (userUuid && !profile) {
        fetchProfile()
      }
    }, delay)

    return () => clearTimeout(timer) // Clean up the timer when the component unmounts
  }, [isLoading, isUserSignIn, profile, router, userUuid])

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
