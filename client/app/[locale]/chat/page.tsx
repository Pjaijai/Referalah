import React from "react"
import ChatPageTemplate from "@/modules/chat/template"

import AuthenticatedPageWrapper from "@/components/wrappers/authenticated/authenticated"

const ChatPage = () => {
  return (
    <AuthenticatedPageWrapper>
      <ChatPageTemplate />
    </AuthenticatedPageWrapper>
  )
}

export default ChatPage
