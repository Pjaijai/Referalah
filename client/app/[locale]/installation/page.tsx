import InstallationPageTemplate from "@/modules/installation/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.installation.metadata

const InstallationPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.installation.name}>
      <InstallationPageTemplate />
    </CommonPageLayout>
  )
}

export default InstallationPage
