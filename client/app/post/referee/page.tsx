import React from "react"
import RefereePostPageTemplate from "@/modules/post/referee/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

const RefereePostPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.refereePost.name}>
      <RefereePostPageTemplate />
    </CommonPageLayout>
  )
}

export default RefereePostPage
