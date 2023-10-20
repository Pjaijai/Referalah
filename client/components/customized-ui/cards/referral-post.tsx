import React, { useMemo, useState } from "react"
import Link from "next/link"
import ContactDialog, {
  IContactDialogProps,
} from "@/modules/referral/components/dialog/contact"
import UserSignInDialog from "@/modules/referral/components/dialog/userSignIn"
import { formatCreatedAt } from "@/utils/common/helpers/format/date"

import { ReferralType } from "@/types/common/referral-type"
import { siteConfig } from "@/config/site"
import useViewport from "@/hooks/common/useViewport"
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
import { Icons } from "@/components/icons"

import CompanyNameDisplay from "../info-display/company"
import IndustryDisplay from "../info-display/industry"
import LocationDisplay from "../info-display/location"
import PostHeader from "../info-display/post-header"
import YearsOfExperienceDisplay from "../info-display/years-of-experience"
import CollapsibleTextWrapper from "../tool/collapsible-text-wrapper"
import TooltipWrapper from "../tool/tooltip-wrapper"

interface IReferralPostCardProps
  extends Omit<
    IContactDialogProps,
    "open" | "username" | "onContactFormClose"
  > {
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
  url: string | null
  createdAt?: string
  createdBy: string
}
const ReferralPostCard: React.FunctionComponent<IReferralPostCardProps> = ({
  jobTitle,
  city,
  companyName,
  country,
  description,
  industry,
  photoUrl,
  province,
  url,
  username,
  yearOfExperience,
  messageType,
  postUuid,
  receiverType,
  toUuid,
  createdAt,
  createdBy,
}) => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const isUserSignIn = useUserStore((state) => state.isSignIn)
  const isReferrer = receiverType === ReferralType.REFERRER
  const { isMobile } = useViewport()

  const handleContactClick = () => {
    if (isUserSignIn) {
      setIsContactFormOpen(true)
    } else {
      setIsAuthOpen(true)
    }
  }

  const formattedCreatedAt = useMemo(
    () => formatCreatedAt(createdAt),
    [createdAt]
  )

  return (
    <>
      <Card className="flex flex-col justify-between rounded shadow-md">
        <div className="flex flex-col items-start justify-start">
          <CardHeader className="w-full pb-2">
            {/* title, subtitle, url, avatar, quick action */}
            <div className="flex flex-row items-start justify-between gap-3 sm:gap-1">
              <div className="mb-2 flex basis-full items-center gap-3 sm:basis-2/3 md:basis-3/5">
                {!isReferrer && (
                  <TooltipWrapper
                    tooltipTrigger={
                      <Link
                        href={`${siteConfig.page.profile.href}/${createdBy}`}
                      >
                        <BaseAvatar
                          fallBack={username[0]}
                          alt={username}
                          url={photoUrl || undefined}
                        />
                      </Link>
                    }
                    tooltipContent={<span>查看用戶檔案</span>}
                  />
                )}
                <PostHeader
                  title={jobTitle}
                  subtitle={
                    companyName ? (
                      <CompanyNameDisplay name={companyName} />
                    ) : undefined
                  }
                  url={url}
                />
              </div>
              <div className="flex items-center">
                {isReferrer && (
                  <div className="mr-2">
                    <TooltipWrapper
                      tooltipTrigger={
                        <Link
                          href={`${siteConfig.page.profile.href}/${createdBy}`}
                        >
                          <BaseAvatar
                            fallBack={username[0]}
                            alt={username}
                            url={photoUrl || undefined}
                          />
                        </Link>
                      }
                      tooltipContent={<span>查看推薦人檔案</span>}
                    />
                  </div>
                )}
                <Button
                  className="px-3"
                  onClick={handleContactClick}
                  size={isMobile ? "icon" : "default"}
                >
                  <Icons.mail className="h-4 w-4 sm:mr-1" />
                  {isMobile ? undefined : `聯絡${isReferrer ? "推薦人" : "我"}`}
                </Button>
              </div>
            </div>

            {/* location, industry, year of exp */}
            <CardDescription className="text-overflow-ellipsis mb-5 mt-2 flex flex-wrap items-center justify-start gap-4">
              {(city || province || country) && (
                <LocationDisplay
                  city={city}
                  province={province}
                  country={country}
                  className="xs:max-w-full max-w-sm"
                />
              )}
              {industry && (
                <IndustryDisplay
                  industry={industry}
                  className="xs:max-w-full max-w-xs"
                />
              )}
              {yearOfExperience !== null && (
                <YearsOfExperienceDisplay
                  yearOfExperience={yearOfExperience}
                  className="xs:max-w-full max-w-xs"
                />
              )}
            </CardDescription>

            <Separator />
          </CardHeader>

          {/* desc */}
          <CardContent>
            {description && (
              <CollapsibleTextWrapper
                text={description}
                className="mt-2 text-sm"
                expandButtonProps={{ className: "mt-2" }}
              />
            )}
          </CardContent>
        </div>

        {/* created at */}
        <CardFooter className="justify-end">
          <CardDescription>{formattedCreatedAt}</CardDescription>
        </CardFooter>
      </Card>

      <ContactDialog
        open={isContactFormOpen}
        username={username}
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

export default ReferralPostCard
