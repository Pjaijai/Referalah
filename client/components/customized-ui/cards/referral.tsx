import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ContactDialog, {
  IContactDialogProps,
} from "@/modules/referral/components/dialog/contact"
import UserSignInDialog from "@/modules/referral/components/dialog/userSignIn"

import { ReferralType } from "@/types/common/referral-type"
import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/store"
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
import CompanyNameDisplay from "@/components/customized-ui/info-display/company"
import IndustryDisplay from "@/components/customized-ui/info-display/industry"
import LocationDisplay from "@/components/customized-ui/info-display/location"
import YearsOfExperienceDisplay from "@/components/customized-ui/info-display/years-of-experience"
import TooltipWrapper from "@/components/customized-ui/tool/tooltip-wrapper"
import { Icons } from "@/components/icons"

interface IReferralCardProps
  extends Omit<
    IContactDialogProps,
    "open" | "username" | "onContactFormClose"
  > {
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
  createdAt?: string
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
  messageType,
  postUuid,
  receiverType,
  toUuid,
}) => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const isUserSignIn = useUserStore((state) => state.isSignIn)
  const router = useRouter()

  const handleContactClick = () => {
    if (isUserSignIn) {
      setIsContactFormOpen(true)
    } else {
      setIsAuthOpen(true)
    }
  }

  const handleProfileClick = () => {
    router.push(`${siteConfig.page.profile.href}/${uuid}`)
  }

  const handleUrlClick = () => {
    if (socialMediaUrl) window.open(socialMediaUrl, "_blank")
  }

  return (
    <>
      <Card className="p-2 rounded shadow-md flex flex-col justify-between">
        {/* avatar, username , title, company, desc, url */}
        <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-0 relative">
          {socialMediaUrl && (
            <div className="absolute top-3 right-3">
              <TooltipWrapper
                tooltipTrigger={
                  <Button variant="link" size="icon" onClick={handleUrlClick}>
                    <Icons.link className="h-4 w-4" />
                  </Button>
                }
                tooltipContent={<span>個人連結</span>}
              />
            </div>
          )}
          <Link href={`${siteConfig.page.profile.href}/${uuid}`}>
            <BaseAvatar
              fallBack={username? username[0] :'?'}
              alt={username}
              url={photoUrl || undefined}
              size="large"
            />
          </Link>
          <Link href={`${siteConfig.page.profile.href}/${uuid}`}>
            <p className="text-xs pt-5">@{username}</p>
          </Link>
          <p className="text-lg font-semibold">{jobTitle}</p>
          {receiverType === ReferralType.REFERRER && companyName && (
            <CompanyNameDisplay name={companyName} />
          )}
          <p className="pt-6 text-sm line-clamp-4">{description}</p>
        </CardHeader>

        {/* location, industry, year of exp */}
        <CardContent className="justify-start">
          <Separator className="my-4" />
          <CardDescription className="text-overflow-ellipsis">
            {(city || province || country) && (
              <LocationDisplay
                city={city}
                province={province}
                country={country}
              />
            )}
            {industry && <IndustryDisplay industry={industry} />}
            {yearOfExperience !== null && (
              <YearsOfExperienceDisplay yearOfExperience={yearOfExperience} />
            )}
          </CardDescription>

          {/* quick actions  */}
          <CardFooter className="p-0 pt-7 flex-col">
            <Button className="w-full" onClick={handleContactClick}>
              <Icons.mail className="mr-1 h-4 w-4" />
              聯絡我
            </Button>

            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={handleProfileClick}
            >
              查看用戶檔案
            </Button>
          </CardFooter>
        </CardContent>
      </Card>

      <ContactDialog
        open={isContactFormOpen}
        username={username? username[0] :'?'}
        onContactFormClose={() => setIsContactFormOpen(false)}
        toUuid={toUuid}
        messageType={messageType}
        postUuid={postUuid}
        receiverType={receiverType}
      />

      <UserSignInDialog
        open={isAuthOpen}
        onDialogClose={() => setIsAuthOpen(false)}
      />
    </>
  )
}

export default ReferralCard
