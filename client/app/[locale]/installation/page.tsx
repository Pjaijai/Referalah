import InstallationPageTemplate from "@/modules/installation/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.installation.metadata

const InstallationPage = async () => {
  const t = await getI18n()
  return (
    <CommonPageLayout title={t("page.installation")}>
      <InstallationPageTemplate />
    </CommonPageLayout>
  )
}

export default InstallationPage
