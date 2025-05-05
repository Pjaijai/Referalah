import React from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"

import { EMessageType } from "@/types/common/message-type"
import { EReferralType } from "@/types/common/referral-type"
import { ISocialLinksData } from "@/types/common/social-links-data"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import RefereeBadge from "@/components/customized-ui/badges/referee/referee"
import ReferrerBadge from "@/components/customized-ui/badges/referrer/referrer"
import ContactButton from "@/components/customized-ui/buttons/contact"
import ContactRequestCountIcon from "@/components/customized-ui/icons/contact-request-count"
import SocialIconWithTooltip from "@/components/customized-ui/icons/social-icon-with-tooltip"

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
  links: ISocialLinksData[]
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
  username,
  uuid,
  yearOfExperience,
  receiverType,
  isReferee,
  isReferrer,
  requestCount,
  links,
}) => {
  const t = useI18n()
  const router = useRouter()

  const handleProfileClick = () => {
    router.push(`${siteConfig.page.profile.href}/${uuid}`)
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
    <Card className="flex h-96 max-w-[448px] flex-col  border-none bg-white shadow-xl">
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

        <div className="flex flex-col-reverse gap-2 md:flex-row">
          {isReferee && <RefereeBadge />}
          {isReferrer && <ReferrerBadge />}
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
            <div className="mt-2 flex flex-wrap items-center justify-start text-xs font-medium">
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
        <p className=" mt-4 line-clamp-2 h-12 max-w-[350px] overflow-hidden text-ellipsis break-all  text-sm font-normal leading-6 md:mt-8">
          {description}
        </p>

        <div className="m-3 flex h-12 w-full flex-row gap-1 md:gap-3">
          {links.map((s, index) => (
            <SocialIconWithTooltip
              type={s.type}
              url={s.url}
              name={s.name}
              key={index}
            />
          ))}
        </div>
        {/* quick actions  */}
        <div className="mb-0 flex w-full flex-row items-center  justify-end gap-2 p-2">
          <Button
            variant="themeSecondary"
            className=" h-14 w-32 border-2 border-muted px-5 py-3 text-sm"
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
