"use client"

import ChatLeftSection from "@/modules/chat/components/sections/left/left"
import ChatRightSection from "@/modules/chat/components/sections/right/right"

const ChatPageTemplate = () => {
  return (
    <div className="flex h-full w-full flex-row">
      <ChatLeftSection />
      <ChatRightSection />
    </div>
  )
}

export default ChatPageTemplate
