"use client"

import React from "react"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import LinkTooltip from "@/components/customized-ui/tool/Link"
import { Icons } from "@/components/icons"

export interface IViewProfileTemplateProps {
  photoUrl?: string
  // chineseFirstName: string | null
  // chineseLastName: string | null
  // englishFirstName: string | null
  // englishLastName: string | null
  username: string | null
  description: string | null
  company: string | null
  jobTitle: string | null
  yearOfExperience?: number | null
  country: string | null
  province: string | null
  industry: string | null
  city: string | null
  // resumeUrl: string | null
  socialMediaUrl: string | null
  isReferer: boolean
  isReferee: boolean

  setIsEditMode: (value: boolean) => void
}
const ViewProfileTemplate: React.FunctionComponent<
  IViewProfileTemplateProps
> = ({
  photoUrl,
  // chineseFirstName,
  // chineseLastName,
  // englishFirstName,
  // englishLastName,
  username,
  description,
  company,
  jobTitle,
  yearOfExperience,
  country,
  province,
  city,
  // resumeUrl,
  socialMediaUrl,
  setIsEditMode,
  industry,
  isReferer,
  isReferee,
}) => {
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
      </div>

      <h5 className="text-2xl text-center font-semibold">{username}</h5>

      <div className="flex flex-col text-center">
        {jobTitle && <h5 className="font-semibold">{jobTitle}</h5>}
        {company && <h5 className="font-semibold ">{company}</h5>}
      </div>

      <li className="flex flex-wrap justify-center w-full gap-2">
        {country && (
          <ul>
            <Badge> {country}</Badge>
          </ul>
        )}

        {province && (
          <ul>
            <Badge> {province}</Badge>
          </ul>
        )}
        {city && (
          <ul>
            <Badge> {city}</Badge>
          </ul>
        )}
      </li>
      <li className="flex flex-wrap justify-center w-full gap-2">
        {industry && (
          <ul>
            <Badge> {industry}</Badge>
          </ul>
        )}

        {yearOfExperience && (
          <ul>
            <Badge> {yearOfExperience}年經驗</Badge>
          </ul>
        )}
      </li>

      <div className="flex justify-center gap-2 mt-8 w-full">
        <div className="flex flex-row items-center gap-2">
          <Checkbox checked={isReferer} />
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            推薦人
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox checked={isReferee} />
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            受薦人
          </label>
        </div>
      </div>

      <div className="container text-center mt-8">
        <div className="text-left inline-block break-all whitespace-pre-wrap">
          {description}
        </div>
      </div>
    </div>
  )
}

export default ViewProfileTemplate
