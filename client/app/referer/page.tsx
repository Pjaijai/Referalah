import { NextPage } from "next"
import RefererPageTemplate from "@/modules/referral/referer/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export function generateMetadata() {
    return siteConfig.page.referrer.metadata
}

const RefererPage: NextPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.referrer.name}>
      <RefererPageTemplate />
    </CommonPageLayout>
  )
}

export default RefererPage
