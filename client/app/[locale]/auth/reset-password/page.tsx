import React from "react"
import ResetPasswordPageTemplate from "@/modules/auth/components/templates/reset-password/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.resetPassword.metadata

const ResetPasswordPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.resetPassword.name}>
      <ResetPasswordPageTemplate />
    </CommonPageLayout>
  )
}

export default ResetPasswordPage
