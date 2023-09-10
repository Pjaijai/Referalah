"use client"

import React from "react"
import Image from "next/image"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export interface IViewProfileTemplateProps {
  photoUrl?: string
  chineseFirstName: string | null
  chineseLastName: string | null
  englishFirstName: string | null
  englishLastName: string | null
  username: string | null
  description: string | null
  company: string | null
  jobTitle: string | null
  yearOfExperience?: number | null
  countryUuid: string | null
  provinceUuid: string | null
  industryUuid: string | null
  cityUuid: string | null
  resumeUrl: string | null
  socialMediaUrl: string | null
  isReferer: boolean
  isReferee: boolean
  industryList: IIndustryResponse[]
  cityList: ICityResponse[]
  countryList: ICountryResponse[]
  provinceList: IProvinceResponse[]
  setIsEditMode: (value: boolean) => void
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
  countryUuid,
  provinceUuid,
  cityUuid,
  resumeUrl,
  socialMediaUrl,
  setIsEditMode,
  industryList,
  countryList,
  provinceList,
  industryUuid,
  cityList,
}) => {
  const country = countryUuid
    ? countryList.find((c) => c.uuid === countryUuid)?.cantonese_name
    : "no country"

  const province = provinceUuid
    ? provinceList.find((p) => p.uuid === provinceUuid)?.cantonese_name
    : "no province"
  const city = cityUuid
    ? cityList.find((ci) => ci.uuid === cityUuid)?.cantonese_name
    : "no city"
  const industry = industryUuid
    ? industryList.find((i) => i.uuid === industryUuid)?.cantonese_name
    : "no industry"

  return (
    <div>
      <Button
        onClick={() => {
          setIsEditMode(true)
        }}
      >
        Edit
      </Button>
      {photoUrl && (
        <Image src={photoUrl} width={200} height={200} alt={username ?? ""} />
      )}

      <div>{username}</div>
      <div>
        {chineseLastName} {chineseFirstName}
      </div>
      <div>
        {englishLastName} {englishFirstName}
      </div>

      <div>{description}</div>
      <div>
        {company} {jobTitle} {yearOfExperience}
      </div>

      <div>
        {country}
        {province}
        {city}
      </div>

      <div>{industry}</div>

      {resumeUrl}
      {socialMediaUrl}
    </div>
  )
}

export default ViewProfileTemplate
