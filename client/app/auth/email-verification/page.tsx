import React from "react"
import EmailVerificationPageTemplate from "@/modules/auth/email-verification/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

const EmailVerificationPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.emailVerification.name}>
      <EmailVerificationPageTemplate />
    </CommonPageLayout>
  )
}

export default EmailVerificationPage
