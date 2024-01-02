import React from "react"
import { useRouter } from "next/navigation"

import { siteConfig } from "@/config/site"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import { Icons } from "@/components/icons"

interface IConversationHeaderProps {
  username: string
  jobTitle: string | null
  companyName: string | null
  avatarUrl?: string | null
  uuid: string
}
const ConversationHeader: React.FunctionComponent<IConversationHeaderProps> = ({
  username,
  jobTitle,
  avatarUrl,
  companyName,
  uuid,
}) => {
  const router = useRouter()
  const handleBackClick = () => {
    router.back()
  }

  const handleAvatarClick = () => {
    router.push(`${siteConfig.page.profile.href}/${uuid}`)
  }
  return (
    <div className="flex flex-row gap-4 p-4">
      <div className="flex flex-row items-center gap-4">
        <Icons.chevronLeft
          className="block hover:cursor-pointer md:hidden"
          onClick={handleBackClick}
        />
        <div className="hover:cursor-pointer" onClick={handleAvatarClick}>
          <BaseAvatar
            fallBack={username[0]}
            size="medium"
            url={avatarUrl || undefined}
            alt={username}
          />
        </div>
      </div>
      <div>
        <h4>{username}</h4>
        <div className="flex flex-row gap-2 text-sm text-muted-foreground">
          {jobTitle ? <p>{jobTitle}</p> : null}
          {companyName ? <p>@{companyName}</p> : null}
        </div>
      </div>
    </div>
  )
}

export default ConversationHeader
