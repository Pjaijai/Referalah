import React from "react"
import { Metadata } from "next"
import ChatPageTemplate from "@/modules/chat/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import AuthenticatedPageWrapper from "@/components/wrappers/authenticated/authenticated"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18n()
  return {
    ...siteConfig.defaultMetaData,
    title: t("page.chat"),
    robots: "noindex, nofollow",
  }
}

const ChatPage = () => {
  return (
    <AuthenticatedPageWrapper>
      <ChatPageTemplate />
    </AuthenticatedPageWrapper>
  )
}

export default ChatPage
