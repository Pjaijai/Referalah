import React from "react"
import ResetPasswordPageTemplate from "@/modules/auth/components/templates/reset-password/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.resetPassword.metadata

const ResetPasswordPage = async () => {
  const t = await getI18n()
  return (
    <CommonPageLayout title={t("page.reset_password")} titlePosition="middle">
      <ResetPasswordPageTemplate />
    </CommonPageLayout>
  )
}

export default ResetPasswordPage
