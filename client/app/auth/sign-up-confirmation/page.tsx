import React from "react"
import SignUpConfirmationPageTemplate from "@/modules/auth/components/templates/confirmation/sign-up/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.signUpConfirmation.metadata

const SignUpConfirmationPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.signUpConfirmation.name}>
      <SignUpConfirmationPageTemplate />
    </CommonPageLayout>
  )
}

export default SignUpConfirmationPage
