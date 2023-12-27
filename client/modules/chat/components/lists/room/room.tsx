import React from "react"
import ChatRoomCard from "@/modules/chat/components/cards/room/room"

const ChatRoomList = () => {
  return (
    <div className="w-full gap-y-2">
      <ChatRoomCard username="oiasjdiosdjiosdjio" text="213123312123123123" />

      <ChatRoomCard
        username="oiasjdiosdjiosdjio"
        text={`123123
      123123
      123123
      123123
      123132`}
      />
    </div>
  )
}

export default ChatRoomList
