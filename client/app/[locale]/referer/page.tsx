import { NextPage } from "next"
import RefererPageTemplate from "@/modules/referral/referer/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.referrer.metadata

const RefererPage: NextPage = async () => {
  const t = await getI18n()
  return (
    <CommonPageLayout title={t("page.referer")}>
      <RefererPageTemplate />
    </CommonPageLayout>
  )
}

export default RefererPage
