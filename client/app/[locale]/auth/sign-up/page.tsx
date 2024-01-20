import React from "react"
import SignUpPageTemplate from "@/modules/auth/components/templates/sign-up/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.signUp.metadata

const SignUpPage = async () => {
  const t = await getI18n()
  return (
    <CommonPageLayout title={t("page.sign_up")}>
      <SignUpPageTemplate />
    </CommonPageLayout>
  )
}

export default SignUpPage
