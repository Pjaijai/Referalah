import React from "react"
import SignInPageTemplate from "@/modules/auth/components/templates/sign-in/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"
import UnauthenticatedPageWrapper from "@/components/wrappers/unauthenticated"

export const metadata = siteConfig.page.signIn.metadata

const SignInPage = async () => {
  const t = await getI18n()
  return (
    <UnauthenticatedPageWrapper>
      <CommonPageLayout title={t("page.sign_in")}>
        <SignInPageTemplate />
      </CommonPageLayout>
    </UnauthenticatedPageWrapper>
  )
}
export default SignInPage
