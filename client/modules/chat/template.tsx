"use client"

import ChatLeftSection from "@/modules/chat/components/sections/left/left"
import ChatRightSection from "@/modules/chat/components/sections/right/right"

const ChatPageTemplate = () => {
  return (
    <div className="flex h-screen w-full flex-row overflow-hidden border-2">
      <ChatLeftSection />
      <ChatRightSection />
    </div>
  )
}

export default ChatPageTemplate
