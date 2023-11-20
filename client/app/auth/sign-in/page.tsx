import React from "react"
import SignInPageTemplate from "@/modules/auth/sign-in/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.signIn.metadata

const SignInPage = () => {
  return (
    <CommonPageLayout>
      <SignInPageTemplate />
    </CommonPageLayout>
  )
}
export default SignInPage
