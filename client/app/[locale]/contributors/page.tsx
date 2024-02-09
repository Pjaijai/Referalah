import ContributorsPageTemplate from "@/modules/contributors/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.contributors.metadata

const ContributorsPage = async () => {
  const t = await getI18n()
  return (
    <CommonPageLayout title={t("page.contributors")}>
      <ContributorsPageTemplate />
    </CommonPageLayout>
  )
}

export default ContributorsPage
