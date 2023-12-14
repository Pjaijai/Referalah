import React from "react"
import ForgotPasswordPageTemplate from "@/modules/auth/components/templates/forgot-password/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.forgetPassword.metadata

const ForgotPasswordPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.forgetPassword.name}>
      <ForgotPasswordPageTemplate />
    </CommonPageLayout>
  )
}

export default ForgotPasswordPage
