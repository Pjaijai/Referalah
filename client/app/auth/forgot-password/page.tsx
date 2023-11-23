import React from "react"
import ForgotPasswordPageTemplate from "@/modules/auth/forgot-password/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.forgetPassword.metadata

const ForgotPasswordPage = () => {
  return (
    <CommonPageLayout>
      <ForgotPasswordPageTemplate />
    </CommonPageLayout>
  )
}

export default ForgotPasswordPage
