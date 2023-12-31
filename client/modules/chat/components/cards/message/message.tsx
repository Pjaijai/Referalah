import React from "react"

import { cn } from "@/lib/utils"

interface IMessageCardProps {
  text: string
  sentByUser: boolean
}
const MessageCard: React.FunctionComponent<IMessageCardProps> = ({
  text,
  sentByUser,
}) => {
  return (
    <div
      className={cn(
        "flex w-full",
        sentByUser ? "justify-end" : " justify-start "
      )}
      data-testid="message-card"
    >
      <div
        className={cn(
          "w-fit max-w-[40%] rounded-lg  px-4 py-2 text-start",
          sentByUser ? "bg-green-200 " : " bg-gray-200"
        )}
      >
        <p className="whitespace-pre-wrap break-words dark:text-black">
          {text}
        </p>
      </div>
    </div>
  )
}

export default MessageCard
