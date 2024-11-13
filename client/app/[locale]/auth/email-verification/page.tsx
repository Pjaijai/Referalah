import React from "react"
import EmailVerificationPageTemplate from "@/modules/auth/components/templates/email-verification/template"
import { getI18n } from "@/utils/services/internationalization/server"

import CommonPageLayout from "@/components/layouts/common"

const EmailVerificationPage = async () => {
  const t = await getI18n()
  return (
    <CommonPageLayout
      title={t("page.email_verification")}
      titlePosition="middle"
    >
      <EmailVerificationPageTemplate />
    </CommonPageLayout>
  )
}

export default EmailVerificationPage
