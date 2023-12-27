import React from "react"

import BaseAvatar from "@/components/customized-ui/avatars/base"

interface IChatRoomCardProps {
  text: string
  username: string
}

const ChatRoomCard: React.FunctionComponent<IChatRoomCardProps> = ({
  username,
  text,
}) => {
  const truncatedText = text.slice(0, 50)
  return (
    <div className="flex flex-row items-center gap-x-3 p-2">
      <BaseAvatar fallBack={"A"} size="medium" url="" alt={""} />
      <div className="flex w-full flex-col">
        <div className="flex flex-row items-center justify-between ">
          <h4 className="font-semibold">{username}</h4>
          <p className="text-sm text-muted-foreground">08:00</p>
        </div>

        <p className="w-5/6 truncate text-muted-foreground">{truncatedText}</p>
      </div>
    </div>
  )
}

export default ChatRoomCard
