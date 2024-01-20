import { NextPage } from "next"
import RefereePageTemplate from "@/modules/referral/referee/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.referee.metadata

const RefereePage: NextPage = async () => {
  const t = await getI18n()
  return (
    <CommonPageLayout title={t("page.referee")}>
      <RefereePageTemplate />
    </CommonPageLayout>
  )
}

export default RefereePage
