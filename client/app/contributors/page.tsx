import React from "react"
import ContributorsPageTemplate from "@/modules/contributors/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

const ContributorsPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.contributors.name}>
      <ContributorsPageTemplate />
    </CommonPageLayout>
  )
}

export default ContributorsPage
