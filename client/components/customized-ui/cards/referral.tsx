import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"

import { EMessageType } from "@/types/common/message-type"
import { EReferralType } from "@/types/common/referral-type"
import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import ContactButton from "@/components/customized-ui/buttons/contact"
import CompanyNameDisplay from "@/components/customized-ui/info-display/company"
import IndustryDisplay from "@/components/customized-ui/info-display/industry"
import LocationDisplay from "@/components/customized-ui/info-display/location"
import YearsOfExperienceDisplay from "@/components/customized-ui/info-display/years-of-experience"
import TooltipWrapper from "@/components/customized-ui/tool/tooltip-wrapper"
import { Icons } from "@/components/icons"

interface IReferralCardProps {
  uuid: string | null
  username: string | null
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
  receiverType: EReferralType
  isReferrer: boolean
  isReferee: boolean
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
  receiverType,
  isReferee,
  isReferrer,
}) => {
  const t = useI18n()
  const router = useRouter()

  const handleProfileClick = () => {
    router.push(`${siteConfig.page.profile.href}/${uuid}`)
  }

  const handleUrlClick = () => {
    if (socialMediaUrl) window.open(socialMediaUrl, "_blank")
  }

  return (
    <Card className="flex flex-col justify-between rounded p-2 shadow-md">
      {/* avatar, username , title, company, desc, url */}
      <CardHeader className="relative flex flex-col items-center justify-center space-y-0 pb-0 text-center">
        <div className="absolute left-3 top-1">
          <div className="flex flex-row gap-2">
            {isReferee && <Badge>{t("user.type.referee")}</Badge>}
            {isReferrer && <Badge>{t("user.type.referrer")}</Badge>}
          </div>
        </div>

        {socialMediaUrl && (
          <div className="absolute right-3 top-0">
            <TooltipWrapper
              tooltipTrigger={
                <Button variant="link" size="icon" onClick={handleUrlClick}>
                  <Icons.link className="h-4 w-4" />
                </Button>
              }
              tooltipContent={<span>{t("general.personal_link")}</span>}
            />
          </div>
        )}

        <Link href={`${siteConfig.page.profile.href}/${uuid}`}>
          <BaseAvatar
            fallBack={username ? username[0] : "?"}
            alt={username}
            url={photoUrl || undefined}
            size="large"
            className="mt-2"
          />
        </Link>
        <Link href={`${siteConfig.page.profile.href}/${uuid}`}>
          <p className="pt-5 text-center text-xs">@{username}</p>
        </Link>

        <p className="text-center text-lg font-semibold">{jobTitle}</p>
        {companyName && <CompanyNameDisplay name={companyName} />}
        <p className="line-clamp-4 whitespace-pre-wrap break-normal pt-6 text-center text-sm">
          {description}
        </p>
      </CardHeader>

      {/* location, industry, year of exp */}
      <CardContent className="justify-start">
        <Separator className="my-4" />
        <CardDescription className="text-overflow-ellipsis flex flex-col">
          {(city || province || country) && (
            <LocationDisplay
              city={city}
              province={province}
              country={country}
              className="mb-1"
            />
          )}
          {industry && <IndustryDisplay industry={industry} className="mb-1" />}
          {yearOfExperience !== null && (
            <YearsOfExperienceDisplay
              yearOfExperience={yearOfExperience}
              className="mb-1"
            />
          )}
        </CardDescription>

        {/* quick actions  */}
        <CardFooter className="flex-col p-0 pt-7">
          <ContactButton
            username={username || "?"}
            toUuid={uuid}
            messageType={EMessageType.REFERRAL}
            receiverType={receiverType}
          />

          <Button
            variant="outline"
            className="mt-2 w-full"
            onClick={handleProfileClick}
          >
            {t("general.check_user_profile")}
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  )
}

export default ReferralCard
