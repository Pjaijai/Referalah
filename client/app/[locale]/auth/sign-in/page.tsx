import React from "react"
import SignInPageTemplate from "@/modules/auth/components/templates/sign-in/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.signIn.metadata

const SignInPage = async () => {
  const t = await getI18n()
  return (
    <CommonPageLayout title={t("page.sign_in")}>
      <SignInPageTemplate />
    </CommonPageLayout>
  )
}
export default SignInPage
