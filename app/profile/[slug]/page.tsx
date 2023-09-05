"use client"

import React, { useEffect, useState } from "react"
import { NextPage } from "next"
import { useRouter } from "next/navigation"
import EditProfileTemplate from "@/modules/profile/edit/template"
import ViewProfileTemplate from "@/modules/profile/view/template"
import { supabase } from "@/utils/services/supabase/config"

import useUserStore from "@/hooks/state/user/useUserStore"

// interface IProfilePageProps extends NextPage {}

const Page = ({ params }: { params: { slug: string } }) => {
  const isUserSignIn = useUserStore((state) => state.isSignIn)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [profile, setProfile] = useState()

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
          .eq("uuid", params.slug)

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

      fetchProfile()
    }, delay)

    return () => clearTimeout(timer) // Clean up the timer when the component unmounts
  }, [isLoading, isUserSignIn, params.slug, router])

  if (isLoading) return <h1>loading</h1>
  if (!isLoading && profile)
    return (
      <div>
        {/* <ViewProfileTemplate
          photoUrl={undefined}
          chineseFirstName={null}
          chineseLastName={null}
          englishFirstName={null}
          englishLastName={null}
          username={"test username"}
          description={null}
          company={null}
          jobTitle={null}
          yearOfExperience={null}
          country={null}
          province={null}
          city={null}
          resumeUrl={null}
          socialMediaUrl={null}
        /> */}

        <EditProfileTemplate
          photoUrl={undefined}
          chineseFirstName={null}
          chineseLastName={null}
          englishFirstName={null}
          englishLastName={null}
          username={"test username"}
          description={null}
          company={null}
          jobTitle={null}
          yearOfExperience={null}
          country={null}
          province={null}
          city={null}
          resumeUrl={null}
          socialMediaUrl={null}
          slug={params.slug}
        />
      </div>
    )
}

export default Page
