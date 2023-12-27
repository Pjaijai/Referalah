import React from "react"

import BaseAvatar from "@/components/customized-ui/avatars/base"
import { Icons } from "@/components/icons"

interface IChatRoomCardProps {
  text: string
  username: string
  unread: boolean
}

const ChatRoomCard: React.FunctionComponent<IChatRoomCardProps> = ({
  username,
  text,
  unread,
}) => {
  const truncatedText = text.slice(0, 50)
  return (
    <div className="flex flex-row items-center gap-x-3 rounded-sm  p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
      <BaseAvatar fallBack={"A"} size="medium" url="" alt={""} />
      <div className="flex w-full flex-col">
        <div className="flex flex-row items-center justify-between ">
          <h4 className="font-semibold">{username}</h4>
          <p className="text-sm text-muted-foreground">08:00</p>
        </div>

        <div className="flex w-full flex-row items-center justify-between">
          <p className="w-5/6 truncate text-muted-foreground">
            {truncatedText}
          </p>
          {unread && (
            <Icons.bigDot className="text-green-700  dark:text-yellow-300" />
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatRoomCard
