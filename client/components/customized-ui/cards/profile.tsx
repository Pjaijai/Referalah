import React, { useState } from "react"
import { useRouter } from "next/navigation"
import ContactDialog, {
  IContactDialogProps,
} from "@/modules/referral/components/dialog/contact"
import UserSignInDialog from "@/modules/referral/components/dialog/userSignIn"

import { ReferralType } from "@/types/common/referral-type"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useUserStore from "@/hooks/state/user/store"
import { Button } from "@/components/ui/button"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import { Icons } from "@/components/icons"

interface IProfileCardProps
  extends Omit<
    IContactDialogProps,
    "open" | "username" | "onContactFormClose"
  > {
  uuid: string | null
  username: string
  photoUrl: string | null
  className?: string
}
const ProfileCard: React.FunctionComponent<IProfileCardProps> = ({
  photoUrl,
  username,
  uuid,
  messageType,
  receiverType,
  toUuid,
  postUuid,
  className,
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

  return (
    <>
      <div
        className={cn(
          "flex h-fit flex-col justify-center rounded border-2 p-5",
          className
        )}
      >
        <div className="flex items-center">
          <BaseAvatar
            fallBack={username ? username[0] : "?"}
            alt={username}
            url={photoUrl || undefined}
            className="mr-2"
          />
          @{username}
        </div>
        <div className="flex flex-row gap-3 p-0 pt-3 md:flex-col md:gap-0 md:pt-4">
          <Button className="w-full" onClick={handleContactClick}>
            <Icons.mail className="mr-1 h-4 w-4" />
            聯絡推薦人
          </Button>

          <Button
            variant="outline"
            className="mt-0 w-full md:mt-2"
            onClick={handleProfileClick}
          >
            查看推薦人
          </Button>
        </div>
      </div>

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

export default ProfileCard
