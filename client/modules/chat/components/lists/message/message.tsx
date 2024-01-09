import React from "react"
import MessageCard from "@/modules/chat/components/cards/message/message"

const MessageList = () => {
  return (
    <div className="flex h-full flex-col gap-2">
      <MessageCard text="123123" sentByUser={true} />
      <MessageCard text={`123123 123123`} sentByUser={false} />
      <MessageCard text={`123123 123123 123123`} sentByUser={true} />
      <MessageCard
        text={`123123 123123
      123123
      123123
      123123
    
      `}
        sentByUser={false}
      />
      <MessageCard
        text={`123123 123123 123123
      
      123123
      123123
      
      123123
      
      123123`}
        sentByUser={false}
      />
    </div>
  )
}

export default MessageList
