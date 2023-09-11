"use client"

import React from "react"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import LinkTooltip from "@/components/customized-ui/tool/Link"
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
    <div className="w-full flex flex-col gap-y-2 mt-28">
      <div className="flex flex-row justify-end w-full mx-8">
        {socialMediaUrl && <LinkTooltip url={socialMediaUrl} />}

        <Button
          onClick={() => {
            setIsEditMode(true)
          }}
          variant="ghost"
        >
          <Icons.pencil />
        </Button>
      </div>

      <div className="flex justify-center">
        <BaseAvatar
          url={photoUrl}
          alt={username}
          fallBack={username && username[0]}
          size="large"
        />
        {!photoUrl && <Icons.user />}
      </div>

      <h5 className="text-2xl text-center font-semibold">{username}</h5>

      <li className="flex flex-wrap justify-center w-full gap-2">
        {country && (
          <ul>
            <Badge className="w-1/5  shrink-0 "> {country}</Badge>
          </ul>
        )}

        {province && (
          <ul>
            <Badge className="w-1/5  shrink-0"> {province}</Badge>
          </ul>
        )}
        {city && (
          <ul>
            <Badge className="w-1/5  shrink-0"> {city}</Badge>
          </ul>
        )}
      </li>
      <li className="flex flex-wrap justify-center w-full gap-2">
        {industry && (
          <ul>
            <Badge className="w-1/5  shrink-0"> {industry}</Badge>
          </ul>
        )}

        {yearOfExperience && (
          <ul>
            <Badge className="w-1/5  shrink-0"> {yearOfExperience}年經驗</Badge>
          </ul>
        )}
      </li>

      <p className="container mt-8">{description}</p>
    </div>
  )
}

export default ViewProfileTemplate
