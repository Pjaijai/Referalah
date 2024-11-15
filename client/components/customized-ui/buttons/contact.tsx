import React, { memo, useState } from "react"
import ContactDialog from "@/modules/member/components/dialog/contact"
import UserSignInDialog from "@/modules/member/components/dialog/userSignIn"
import { useI18n } from "@/utils/services/internationalization/client"

import { EMessageType } from "@/types/common/message-type"
import { EReferralType } from "@/types/common/referral-type"
import { cn } from "@/lib/utils"
import useUserStore from "@/hooks/state/user/store"
import { Button } from "@/components/ui/button"

interface IContactButtonProps {
  username: string | null
  toUuid: string | null
  messageType: EMessageType
  postUuid?: string | null
  receiverType?: EReferralType
  buttonClassName?: string
}
const ContactButton: React.FunctionComponent<IContactButtonProps> = ({
  username,
  toUuid,
  messageType,
  postUuid,
  receiverType,
  buttonClassName,
}) => {
  const t = useI18n()
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const isUserSignIn = useUserStore((state) => state.isSignIn)

  const handleContactClick = () => {
    if (isUserSignIn) {
      setIsContactFormOpen(true)
    } else {
      setIsAuthOpen(true)
    }
  }

  return (
    <>
      <Button
        variant={"theme"}
        className={cn("flex w-full flex-row gap-1", buttonClassName)}
        onClick={handleContactClick}
      >
        {/* TODO: remove the copy */}
        {/* <p> {t("general.contact")}</p> */}
        <p> Coffee Chat</p>
      </Button>

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

export default memo(ContactButton)
