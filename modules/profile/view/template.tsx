"use client"

import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"

export interface IViewProfileTemplateProps {
  photoUrl?: string
  chineseFirstName: string | null
  chineseLastName: string | null
  englishFirstName: string | null
  englishLastName: string | null
  username: string
  description: string | null
  company: string | null
  jobTitle: string | null
  yearOfExperience?: number | null
  country: string | null
  province: string | null
  city: string | null
  resumeUrl: string | null
  socialMediaUrl: string | null
  isReferer: boolean
  isReferee: boolean
}
const ViewProfileTemplate: React.FunctionComponent<
  IViewProfileTemplateProps
> = ({
  photoUrl,
  chineseFirstName,
  chineseLastName,
  englishFirstName,
  englishLastName,
  username,
  description,
  company,
  jobTitle,
  yearOfExperience,
  country,
  province,
  city,
  resumeUrl,
  socialMediaUrl,
}) => {
  return (
    <div>
      <Avatar>
        <AvatarImage src={photoUrl} alt={username} />
        <AvatarFallback>
          <Icons.user />
        </AvatarFallback>
      </Avatar>
      <div>{username}</div>
      <div>
        {chineseLastName} {chineseFirstName}
      </div>
      <div>
        {englishLastName} {englishFirstName}
      </div>

      <div>
        {company} {jobTitle} {yearOfExperience}
      </div>

      <div>
        {country}
        {province}
        {city}
      </div>

      {resumeUrl}
      {socialMediaUrl}
    </div>
  )
}

export default ViewProfileTemplate
