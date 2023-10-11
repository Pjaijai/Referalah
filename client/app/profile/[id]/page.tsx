"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import EditProfileTemplate from "@/modules/profile/edit/template"
import ViewProfileTemplate from "@/modules/profile/view/template"

import { siteConfig } from "@/config/site"
import useGetUserprofile from "@/hooks/api/user/get-user-profile"
import useUserStore from "@/hooks/state/user/store"
import { Icons } from "@/components/icons"

const Page = ({ params }: { params: { slug: string } }) => {
  const pathname = usePathname()
  const uuid = pathname.split("/")[2] ?? null
  const { data: profile, isLoading, isError } = useGetUserprofile(uuid)

  if (!isLoading && profile === null)
    return (
      <div className="flex flex-col  justify-center items-center rounded-lg p-4 gap-4  h-screen">
        <span className="text-5xl">🥲</span>
        <h6>
          搵唔到用戶資料請refresh網頁或先
          <Link
            href={siteConfig.page.auth.href}
            className="border-b-2 border-green-700 text-green-700 dark:border-yellow-300 dark:text-yellow-300 "
          >
            {" "}
            登入
          </Link>
        </h6>
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
          showEditButton={false}
        />
      </div>
    )
}

export default Page
