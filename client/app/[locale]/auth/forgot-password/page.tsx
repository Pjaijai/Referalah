import React from "react"
import ForgotPasswordPageTemplate from "@/modules/auth/components/templates/forgot-password/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.forgetPassword.metadata

const ForgotPasswordPage = async () => {
  const t = await getI18n()
  return (
    <CommonPageLayout title={t("page.forgot_password")}>
      <ForgotPasswordPageTemplate />
    </CommonPageLayout>
  )
}

export default ForgotPasswordPage
