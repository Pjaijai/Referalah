import React, { memo, useState } from "react"
import ContactDialog from "@/modules/referral/components/dialog/contact"
import UserSignInDialog from "@/modules/referral/components/dialog/userSignIn"

import { EMessageType } from "@/types/common/message-type"
import { ReferralType } from "@/types/common/referral-type"
import useUserStore from "@/hooks/state/user/store"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface IContactButtonProps {
  username: string | null
  toUuid: string | null
  messageType: EMessageType
  postUuid?: string | null
  receiverType?: ReferralType
}
const ContactButton: React.FunctionComponent<IContactButtonProps> = ({
  username,
  toUuid,
  messageType,
  postUuid,
  receiverType,
}) => {
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
      <Button className="w-full" onClick={handleContactClick}>
        <Icons.mail className="mr-1 h-4 w-4" />
        聯絡{messageType === EMessageType.POST ? "推薦人" : "我"}
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
