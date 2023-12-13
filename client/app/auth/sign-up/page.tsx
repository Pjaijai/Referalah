import React from "react"
import SignUpPageTemplate from "@/modules/auth/components/templates/sign-up/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.signUp.metadata

const SignUpPage = () => {
  return (
    <CommonPageLayout title="註冊帳戶">
      <SignUpPageTemplate />
    </CommonPageLayout>
  )
}

export default SignUpPage
