import React from "react"
import EmailVerificationPageTemplate from "@/modules/auth/email-verification/template"

import CommonPageLayout from "@/components/layouts/common"

const EmailVerificationPage = () => {
  return (
    <CommonPageLayout title="Send 咗！">
      <EmailVerificationPageTemplate />
    </CommonPageLayout>
  )
}

export default EmailVerificationPage
