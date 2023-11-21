import React from "react"
import SignUpPageTemplate from "@/modules/auth/sign-up/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.signUp.metadata

const SignUpPage = () => {
  return (
    <CommonPageLayout>
      <SignUpPageTemplate />
    </CommonPageLayout>
  )
}

export default SignUpPage
