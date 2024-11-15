import React from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"

import { EMessageType } from "@/types/common/message-type"
import { EReferralType } from "@/types/common/referral-type"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import ContactButton from "@/components/customized-ui/buttons/contact"
import ContactRequestCountIcon from "@/components/customized-ui/icons/contact-request-count"
import { Icons } from "@/components/icons"

interface IMemberCardProps {
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
  requestCount: number
}

const MemberCard: React.FunctionComponent<IMemberCardProps> = ({
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
  requestCount,
}) => {
  const t = useI18n()
  const router = useRouter()

  const handleProfileClick = () => {
    router.push(`${siteConfig.page.profile.href}/${uuid}`)
  }

  const handleUrlClick = () => {
    if (socialMediaUrl) window.open(socialMediaUrl, "_blank")
  }

  const location = city || province || country

  const info = [
    location,
    yearOfExperience ? `${yearOfExperience} YOE` : null,
    industry,
  ].filter(Boolean)

  const professionalInfo = [
    jobTitle,
    companyName ? ` @ ${companyName}` : null,
  ].filter(Boolean)

  return (
    <Card className="flex h-96 w-[448px] flex-col  bg-white">
      {/* avatar, username , title, company, desc, url */}
      <CardHeader className=" flex flex-row  items-center justify-between ">
        <div className="flex flex-row items-center justify-center gap-2">
          <BaseAvatar
            fallBack={username ? username[0] : "?"}
            alt={username}
            url={photoUrl || undefined}
          />
          <p className="text-center text-xs text-muted-foreground">
            @{username}
          </p>
        </div>

        <div className="flex flex-row gap-2">
          {isReferee && (
            <div className="py flex items-center justify-center rounded-lg bg-teal-400 px-3 text-white">
              {t("user.type.referee")}
            </div>
          )}
          {isReferrer && (
            <div className="py  flex items-center justify-center rounded-lg bg-orange-400 px-3 text-white">
              {t("user.type.referrer")}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex h-16 flex-row items-center justify-between ">
          <div className="flex flex-col ">
            <div className="flex flex-wrap items-center justify-start  text-xl font-semibold">
              {professionalInfo.map((i, index) => (
                <React.Fragment key={index}>
                  <span />
                  <span>{i}</span>
                </React.Fragment>
              ))}
            </div>
            <div className="mt-2 flex flex-row items-center justify-start text-xs font-medium">
              {info.map((i, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="mx-2">•</span>}
                  <span>{i}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <ContactRequestCountIcon
            className="justify-start"
            count={requestCount}
            status={requestCount > 0 ? "active" : "inactive"}
            size="medium"
          />
        </div>
        <p className="mt-8 line-clamp-2 h-12 w-[400px] overflow-hidden text-ellipsis break-words  text-sm font-normal leading-6">
          {description}
        </p>

        <div className="flex h-16 flex-row items-center justify-start ">
          <Icons.link />
        </div>
        {/* quick actions  */}
        <div className="flex w-full flex-row items-center justify-end  gap-2 p-2">
          <Button
            variant="themeSecondary"
            className=" h-12 w-32 border-2 border-muted px-5 py-3 text-sm"
            onClick={handleProfileClick}
          >
            {t("general.check_user_profile")}
          </Button>

          <ContactButton
            username={username || "?"}
            toUuid={uuid}
            messageType={EMessageType.REFERRAL}
            receiverType={receiverType}
            buttonClassName="h-12 w-32 px-5 py-3 text-sm"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default MemberCard
