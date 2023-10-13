import React, { useMemo, useState } from "react"
import Link from "next/link"
import ContactDialog, {
  IContactDialogProps,
} from "@/modules/referral/components/dialog/contact"
import UserSignInDialog from "@/modules/referral/components/dialog/userSignIn"
import { formatCreatedAt } from "@/utils/common/helpers/format/date"

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
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import { Icons } from "@/components/icons"

import IndustryDisplay from "../info-display/industry"
import LocationDisplay from "../info-display/location"
import PostHeader from "../info-display/post-header"
import YearsOfExperienceDisplay from "../info-display/years-of-experience"
import Trunclater from "../tool/collapsable-text-wrapper"
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
  uuid,
  yearOfExperience,
  messageType,
  postUuid,
  receiverType,
  toUuid,
  createdAt,
}) => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const isUserSignIn = useUserStore((state) => state.isSignIn)
  const isReferrer = receiverType === ReferralType.REFERRER

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
      <Card className="rounded shadow-md flex flex-col justify-between">
        <div className="flex flex-col justify-start items-start">
          <CardHeader className="w-full pb-2">
            {/* title, subtitle, url, avatar, quick action */}
            <div className="flex flex-row justify-between items-start">
              {isReferrer ? (
                <PostHeader
                  title={jobTitle}
                  subtitle={
                    <>
                      <Icons.company width="13" />
                      <span className="ml-1">{companyName}</span>
                    </>
                  }
                  url={url}
                />
              ) : (
                <div className="flex items-center gap-3 mb-2">
                  <Link href={`${siteConfig.page.profile.href}/${uuid}`}>
                    <BaseAvatar
                      fallBack={username[0]}
                      alt={username}
                      url={photoUrl || undefined}
                    />
                  </Link>
                  <PostHeader
                    title={jobTitle}
                    subtitle={
                      <Link
                        href={`${siteConfig.page.profile.href}/${uuid}`}
                        className="mt-1"
                      >
                        <span>@{username}</span>
                      </Link>
                    }
                    url={url}
                  />
                </div>
              )}
              <div className="flex items-center">
                {isReferrer && (
                  <div className="mr-2">
                    <TooltipWrapper
                      tooltipTrigger={
                        <Link href={`${siteConfig.page.profile.href}/${uuid}`}>
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
                <Button className="px-3" onClick={handleContactClick}>
                  <Icons.mail className="mr-1 h-4 w-4" />
                  聯絡{isReferrer ? "推薦人" : "我"}
                </Button>
              </div>
            </div>

            {/* location, industry, year of exp */}
            <CardDescription className="text-overflow-ellipsis flex justify-start gap-4 mt-2 mb-5 items-center">
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

            <Separator />
          </CardHeader>

          {/* desc */}
          <CardContent>
            {description && (
              <Trunclater
                text={description}
                className="text-sm mt-2"
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
