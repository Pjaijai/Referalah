import React from "react"
import VerifyEmailTokenPageTemplate from "@/modules/auth/components/templates/verify-one-time-password/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.verifyOneTimePassword.metadata

const VerifyOneTimePassword = async () => {
  const t = await getI18n()
  return (
    <CommonPageLayout title={t("page.verify_one_time_password")}>
      <VerifyEmailTokenPageTemplate />
    </CommonPageLayout>
  )
}

export default VerifyOneTimePassword
