import React from "react"

import BaseAvatar from "@/components/customized-ui/avatars/base"

interface IConversationHeaderProps {
  username: string
  jobTitle: string | null
  companyName: string | null
}
const ConversationHeader: React.FunctionComponent<IConversationHeaderProps> = ({
  username,
  jobTitle,
  companyName,
}) => {
  return (
    <div className="flex flex-row gap-4 p-4">
      <BaseAvatar fallBack={"A"} size="medium" url="" alt={""} />
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
