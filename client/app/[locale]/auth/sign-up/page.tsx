import React from "react"
import SignUpPageTemplate from "@/modules/auth/components/templates/sign-up/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"
import NotAuthOnlyWrapper from "@/components/wrappers/not-auth-only/not-auth-only"

export const metadata = siteConfig.page.signUp.metadata

const SignUpPage = async () => {
  const t = await getI18n()
  return (
    <NotAuthOnlyWrapper>
      <CommonPageLayout title={t("page.sign_up")} titlePosition="middle">
        <SignUpPageTemplate />
      </CommonPageLayout>
    </NotAuthOnlyWrapper>
  )
}

export default SignUpPage
