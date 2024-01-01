import React from "react"
import { formatCreatedAt } from "@/utils/common/helpers/format/created-at"

import { cn } from "@/lib/utils"

interface IMessageCardProps {
  text: string
  sentByUser: boolean
  createdAt: string // datetime string
}
const MessageCard: React.FunctionComponent<IMessageCardProps> = ({
  text,
  sentByUser,
  createdAt,
}) => {
  const { formattedDate } = formatCreatedAt(createdAt)
  return (
    <div
      className={cn(
        "flex w-full",
        sentByUser ? "justify-end" : " justify-start "
      )}
    >
      <div className="flex w-fit max-w-[70%] flex-col">
        <div
          className={cn(
            " rounded-lg px-2 py-1 text-start",
            sentByUser ? "bg-green-200 " : " bg-gray-200"
          )}
          data-testid="message-card"
        >
          <div className="flex flex-col items-center ">
            <p className="whitespace-pre-wrap break-words  text-start dark:text-black">
              {text}
            </p>
          </div>
        </div>

        <div className={"flex w-full flex-row justify-end "}>
          <p className={"text-end text-xs text-muted-foreground"}>
            {formattedDate}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MessageCard
