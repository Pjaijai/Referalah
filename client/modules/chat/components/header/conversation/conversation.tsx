import React from "react"

import BaseAvatar from "@/components/customized-ui/avatars/base"

interface IConversationHeaderProps {
  username: string
  jobTitle: string | null
  companyName: string | null
  avatarUrl?: string | null
}
const ConversationHeader: React.FunctionComponent<IConversationHeaderProps> = ({
  username,
  jobTitle,
  avatarUrl,
  companyName,
}) => {
  return (
    <div className="flex flex-row gap-4 p-4">
      <BaseAvatar
        fallBack={username[0]}
        size="medium"
        url={avatarUrl || undefined}
        alt={username}
      />
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
