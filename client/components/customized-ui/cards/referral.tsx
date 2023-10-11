import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ContactDialog, {
  IContactDialogProps,
} from "@/modules/referral/components/dialog/contact"
import UserSignInDialog from "@/modules/referral/components/dialog/userSignIn"
import { formatLocation } from "@/utils/common/helpers/format/location"

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import { Icons } from "@/components/icons"

interface IReferralCardProps
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
        <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-0 relative">
          {socialMediaUrl && (
            <div className="absolute top-0 right-0">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="link" size="icon" onClick={handleUrlClick}>
                      <Icons.link className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>個人連結</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          <Link href={`${siteConfig.page.profile.href}/${uuid}`}>
            <BaseAvatar
              fallBack={username[0]}
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
            <div className="flex justify-start items-center text-sm text-muted-foreground">
              <Icons.company width="13" />
              <span className="ml-1">{companyName}</span>
            </div>
          )}
          <p className="pt-6 text-sm line-clamp-4">{description}</p>
        </CardHeader>
        <CardContent className="justify-start">
          <div className="relative py-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <CardDescription className="text-overflow-ellipsis">
            {(city || province || country) && (
              <div className="flex justify-start">
                <Icons.location width="18" />
                <span className="ml-2">
                  {formatLocation(city, province, country)}
                </span>
              </div>
            )}
            {industry && (
              <div className="flex justify-start">
                <Icons.industry width="18" />
                <span className="ml-2">{industry}</span>
              </div>
            )}
            {yearOfExperience !== null && (
              <div className="flex justify-start">
                <Icons.yearsOfExp width="18" />
                <span className="ml-2">{yearOfExperience}年經驗</span>
              </div>
            )}
          </CardDescription>

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
              睇吓Profile先！
            </Button>
          </CardFooter>
        </CardContent>
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

export default ReferralCard
