import React, { useEffect, useState } from "react"
import ContactDialog, {
  IContactDialogProps,
} from "@/modules/referral/components/dialog/contact"
import UserSignInDialog from "@/modules/referral/components/dialog/userSignIn"
import ReferralCardDropDownMenu from "@/modules/referral/components/drop-down-menu/card"
import compareDateDifferenceHelper from "@/utils/common/helpers/time/compareDateDifference"

import useUserStore from "@/hooks/state/user/useUserStore"
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
  createdAt,
}) => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [dateDiffText, setDateDiffText] = useState<undefined | string>()
  const isUserSignIn = useUserStore((state) => state.isSignIn)

  useEffect(() => {
    if (createdAt) {
      const difference = compareDateDifferenceHelper({
        newDate: new Date().toString(),
        oldDate: createdAt,
        unit: "day",
      })
      if (difference === 0) {
        setDateDiffText("今日")
      }
      if (difference > 0 && difference < 30) {
        setDateDiffText(`${difference}日`)
      } else {
        setDateDiffText(`30日+`)
      }
    }
  }, [createdAt])

  const handleContactClick = () => {
    if (isUserSignIn) {
      setIsContactFormOpen(true)
    } else {
      setIsAuthOpen(true)
    }
  }
  return (
    <Card className="flex w-full h-500 md:h-[400px] flex-col justify-between border-2">
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

      <CardHeader className="justify-between">
        <CardTitle className="flex  flex-row justify-between items-center">
          <span className="truncate">{jobTitle}</span>
          <ReferralCardDropDownMenu
            url={socialMediaUrl}
            onContactClick={handleContactClick}
          />
        </CardTitle>
        <CardDescription>{companyName}</CardDescription>
      </CardHeader>

      <CardContent className="hidden h-full w-full md:flex flex-col md:flex-row">
        <div className="flex flex-col items-center justify-start w-[35%]">
          <BaseAvatar
            fallBack={username[0]}
            alt={username}
            url={photoUrl || undefined}
            size="large"
          />

          <p className="text-lg mt-12 font-semibold">{username}</p>
        </div>

        <ScrollArea className="h-[240px] w-[65%]  text-center">
          <div className="text-left inline-block break-all whitespace-pre-wrap">
            {description}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="hidden md:flex md:justify-between md:gap-4">
        <div>
          {country && <Badge variant="outline">{country}</Badge>}
          {province && <Badge variant="outline">{province}</Badge>}
          {city && <Badge variant="outline">{city}</Badge>}
          {industry && <Badge variant="outline">{industry}</Badge>}
          {typeof yearOfExperience === "number" && yearOfExperience >= 0 && (
            <Badge variant="outline">{yearOfExperience}年經驗</Badge>
          )}
        </div>

        {dateDiffText && (
          <p className="text-muted-foreground text-sm ">{dateDiffText}</p>
        )}
      </CardFooter>

      {/* for small screen */}
      <CardContent className="flex h-full w-full md:hidden flex-col">
        <ScrollArea className="h-[200px] text-center">
          <div className="text-left inline-block break-all whitespace-pre-wrap">
            {description}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex flex-col md:hidden">
        <div className="flex flex-row justify-center items-center w-full">
          <BaseAvatar
            fallBack={username[0]}
            alt={username}
            url={photoUrl || undefined}
          />
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
        {dateDiffText && (
          <p className="text-muted-foreground text-sm ">{dateDiffText}</p>
        )}
      </CardFooter>
    </Card>
  )
}

export default ReferralCard
