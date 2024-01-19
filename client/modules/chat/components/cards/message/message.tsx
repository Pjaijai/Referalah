import React from "react"

import { cn } from "@/lib/utils"
import useCreatedAt from "@/hooks/common/created-at"

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
  const { data: formattedDate } = useCreatedAt({ createdAt })

  return (
    <div
      className={cn(
        "flex w-full justify-end",
        sentByUser ? "justify-end" : " justify-start "
      )}
    >
      <div className="flex w-fit max-w-[70%] flex-row">
        <div
          className={cn(
            " flex flex-row rounded-l-2xl p-3",
            sentByUser
              ? "bg-green-300 dark:bg-[#164E63] "
              : " bg-slate-50 shadow-sm dark:bg-slate-600"
          )}
          data-testid="message-card"
        >
          <p className="shrink-0 whitespace-pre-wrap break-all text-start  text-black dark:text-white">
            {text}
          </p>
        </div>
        <div
          className={cn(
            "flex items-end justify-end rounded-r-2xl text-end text-xs  text-slate-700 dark:text-slate-400",
            sentByUser
              ? "bg-green-300  dark:bg-[#164E63]"
              : " bg-slate-50 shadow-sm dark:bg-slate-600"
          )}
        >
          <p className="mb-1 mr-2">
            {formattedDate}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MessageCard
