import React from "react"
import NotificationPageTemplate from "@/modules/notification/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"
import AuthenticatedPageWrapper from "@/components/wrappers/authenticated"

export const metadata = siteConfig.page.notification.metadata

const NotificationPage = () => {
  return (
    <AuthenticatedPageWrapper>
      <CommonPageLayout title={siteConfig.page.notification.name}>
        <NotificationPageTemplate />
      </CommonPageLayout>
    </AuthenticatedPageWrapper>
  )
}

export default NotificationPage
