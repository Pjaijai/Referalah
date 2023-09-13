import React, { useState } from "react"
import ContactDialog from "@/modules/referral/components/dialog/contact"
import ReferralCardDropDownMenu from "@/modules/referral/components/drop-down-menu/card"

import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import LinkTooltip from "@/components/customized-ui/tool/Link"
import { Icons } from "@/components/icons"

interface IReferralCardProps {
  uuid: string | null
  username: string
  photoUrl: string | null
  description: string | null
  companyName: string | null
  jobTitle: string | null
  yearOfExperience: number | null
  country: string | null
  province: string | null
  city: string | null
  industry: string | null
  socialMediaUrl: string | null
}
const ReferralCard: React.FunctionComponent<IReferralCardProps> = ({
  jobTitle,
  city,
  companyName,
  country,
  description,
  industry,
  photoUrl,
  province,
  socialMediaUrl,
  username,
  uuid,
  yearOfExperience,
}) => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  return (
    <Card className="flex w-full h-500 md:h-[400px] flex-col justify-between border-2">
      <ContactDialog
        open={isContactFormOpen}
        username={username}
        onContactFormClose={() => setIsContactFormOpen(false)}
      />

      <CardHeader className="justify-between">
        <CardTitle className="flex  flex-row justify-between items-center">
          <span className="truncate">{jobTitle}</span>
          <ReferralCardDropDownMenu
            url={socialMediaUrl}
            onContactClick={() => setIsContactFormOpen(true)}
          />
        </CardTitle>
        <CardDescription>{companyName}</CardDescription>
      </CardHeader>

      <CardContent className="hidden h-full w-full md:flex flex-col md:flex-row">
        <div className="flex flex-col items-center justify-start w-1/4">
          {photoUrl && (
            <BaseAvatar
              fallBack={username[0]}
              alt={username}
              url={undefined}
              size="large"
            />
          )}
          <p className="text-lg mt-12 font-semibold">{username}</p>
        </div>

        <ScrollArea className="h-[240px] w-3/4 whitespace-pre-wrap ">
          {description}
        </ScrollArea>
      </CardContent>

      <CardFooter className="hidden md:flex md:justify-start md:gap-4">
        {country && <Badge variant="outline">{country}</Badge>}
        {province && <Badge variant="outline">{province}</Badge>}
        {city && <Badge variant="outline">{city}</Badge>}
        {industry && <Badge variant="outline">{industry}</Badge>}
        {typeof yearOfExperience === "number" && yearOfExperience >= 0 && (
          <Badge variant="outline">{yearOfExperience}年經驗</Badge>
        )}
      </CardFooter>

      {/* for small screen */}
      <CardContent className="flex h-full w-full md:hidden flex-col ">
        <ScrollArea className="h-[200px] whitespace-pre-wrap ">
          {description}
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex flex-col md:hidden">
        <div className="flex flex-row justify-center items-center w-full">
          {photoUrl && (
            <BaseAvatar fallBack={username[0]} alt={username} url={undefined} />
          )}
          <p>{username}</p>
        </div>

        <div className="md:hidden flex flex-wrap gap-4 mt-2">
          {country && <Badge variant="outline">{country}</Badge>}
          {province && <Badge variant="outline">{province}</Badge>}
          {city && <Badge variant="outline">{city}</Badge>}
        </div>
        <div>
          {industry && <Badge variant="outline">{industry}</Badge>}
          {typeof yearOfExperience === "number" && yearOfExperience >= 0 && (
            <Badge variant="outline">{yearOfExperience}年經驗</Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default ReferralCard
