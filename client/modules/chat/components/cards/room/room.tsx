import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { formatCreatedAt } from "@/utils/common/helpers/format/created-at"

import { cn } from "@/lib/utils"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import { Icons } from "@/components/icons"

interface IChatRoomCardProps {
  username: string
  text: string | null
  unread: boolean
  avatarUrl: null | string
  updatedAt: string | null //datetime with timezone
  uuid: string
}

const ChatRoomCard: React.FunctionComponent<IChatRoomCardProps> = ({
  text,
  unread,
  username,
  avatarUrl,
  updatedAt,
  uuid,
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const truncatedText = text ? text.slice(0, 35) : ""
  const { formattedDate } = formatCreatedAt(updatedAt)
  const currentChatRoom = searchParams.get("room")
  const handleClick = () => {
    const param = new URLSearchParams()
    param.set("conversation", uuid)
    router.push("?" + param.toString())
  }
  const isCurrentChatRoom = currentChatRoom === uuid

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex w-full flex-row items-center gap-x-3 rounded-sm  p-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
        isCurrentChatRoom && "bg-gray-100 dark:bg-gray-700"
      )}
    >
      <BaseAvatar
        fallBack={username[0]}
        size="medium"
        url={avatarUrl || undefined}
        alt={username}
      />
      <div className="flex w-full flex-col">
        <div className="flex flex-row items-center justify-between ">
          <h4 className="font-semibold">{username}</h4>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>

        <div className="relative flex w-full  flex-row items-center justify-between">
          <p className="w-5/6 truncate text-muted-foreground">
            {truncatedText}
          </p>
          {!unread && (
            <Icons.bigDot className="absolute right-0 text-green-700  dark:text-yellow-300" />
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatRoomCard
