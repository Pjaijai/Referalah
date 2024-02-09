import React from "react"
import SignUpConfirmationPageTemplate from "@/modules/auth/components/templates/confirmation/sign-up/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.signUpConfirmation.metadata

const SignUpConfirmationPage = async () => {
  const t = await getI18n()
  return (
    <CommonPageLayout title={t("page.sign_up_confirmation")}>
      <SignUpConfirmationPageTemplate />
    </CommonPageLayout>
  )
}

export default SignUpConfirmationPage
