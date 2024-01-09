import React from "react"
import ChatPageTemplate from "@/modules/chat/template"

import CommonPageLayout from "@/components/layouts/common"
import AuthenticatedPageWrapper from "@/components/wrappers/authenticated"

const ChatPage = () => {
  return (
    <AuthenticatedPageWrapper>
      <CommonPageLayout>
        <ChatPageTemplate />
      </CommonPageLayout>
    </AuthenticatedPageWrapper>
  )
}

export default ChatPage
