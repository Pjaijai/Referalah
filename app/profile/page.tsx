"use client"

import React, { useEffect, useState } from "react"
import { NextPage } from "next"
import { useRouter } from "next/navigation"
import EditProfileTemplate from "@/modules/profile/edit/template"
import ViewProfileTemplate from "@/modules/profile/view/template"
import { supabase } from "@/utils/services/supabase/config"

import useGetIndustryList from "@/hooks/api/industry/useGetIndustryList"
import useGetCityList from "@/hooks/api/location/useGetCityList"
import useGetCountryList from "@/hooks/api/location/useGetCountryList"
import useGetProvinceList from "@/hooks/api/location/useGetProvinceList"
import useUserStore from "@/hooks/state/user/useUserStore"

// interface IProfilePageProps extends NextPage {}

const Page = ({ params }: { params: { slug: string } }) => {
  const isUserSignIn = useUserStore((state) => state.isSignIn)
  const userUuid = useUserStore((state) => state.uuid)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [profile, setProfile] = useState<IUserResponse | null>()
  const { industry: industryList } = useGetIndustryList()
  const { city: cityList } = useGetCityList()
  const { country: countryList } = useGetCountryList()
  const { province: provinceList } = useGetProvinceList()
  const [isEditMode, setIsEditMode] = useState(false)

  console.log("userUuid", userUuid)
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
          .select("*")
          .eq("uuid", userUuid)
        console.log("fire", data)
        if (error) {
          // Handle the error, e.g., show an error message or redirect
          console.error("Error fetching user:", error)
          return
        }

        if (data && data.length > 0) {
          setProfile(data[0])
        } else {
          // Handle the case where no user with the given slug was found
          console.warn("User not found")
        }
        setIsLoading(false)
      }

      if (userUuid && !profile) {
        fetchProfile()
      }
    }, delay)

    return () => clearTimeout(timer) // Clean up the timer when the component unmounts
  }, [isLoading, isUserSignIn, profile, router, userUuid])

  console.log("profileprofile", profile)
  if (isLoading) return <h1>loading</h1>
  if (!isLoading && profile)
    return (
      <div>
        {!isEditMode && (
          <ViewProfileTemplate
            photoUrl={profile.avatar_url || undefined}
            chineseFirstName={profile.chinese_first_name}
            chineseLastName={profile.chinese_last_name}
            englishFirstName={profile.english_first_name}
            englishLastName={profile.english_last_name}
            username={profile.username}
            description={profile.description}
            company={profile.company_name}
            jobTitle={profile.job_title}
            yearOfExperience={profile.year_of_experience}
            countryUuid={profile.country_uuid}
            provinceUuid={profile.province_uuid}
            cityUuid={profile.city_uuid}
            resumeUrl={profile.resume_url}
            industryUuid={profile.industry_uuid}
            socialMediaUrl={profile.social_media_url}
            industryList={industryList}
            cityList={cityList}
            countryList={countryList}
            provinceList={provinceList}
            isReferee={profile.is_referee}
            isReferer={profile.is_referee}
            setIsEditMode={setIsEditMode}
          />
        )}

        {isEditMode && (
          <EditProfileTemplate
            photoUrl={profile.avatar_url || undefined}
            chineseFirstName={profile.chinese_first_name}
            chineseLastName={profile.chinese_last_name}
            englishFirstName={profile.english_first_name}
            englishLastName={profile.english_last_name}
            username={profile.username}
            description={profile.description}
            company={profile.company_name}
            jobTitle={profile.job_title}
            yearOfExperience={profile.year_of_experience}
            countryUuid={profile.country_uuid}
            provinceUuid={profile.province_uuid}
            cityUuid={profile.city_uuid}
            resumeUrl={profile.resume_url}
            industryUuid={profile.industry_uuid}
            socialMediaUrl={profile.social_media_url}
            industryList={industryList}
            cityList={cityList}
            countryList={countryList}
            provinceList={provinceList}
            isReferee={profile.is_referee}
            isReferer={profile.is_referee}
            isProfileLoading={isLoading}
            setIsEditMode={setIsEditMode}
          />
        )}
      </div>
    )
}

export default Page
