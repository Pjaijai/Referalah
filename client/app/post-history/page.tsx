import React from "react"
import PostHistoryTemplate from "@/modules/post-history/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

const PostHistoryPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.postHistory.name}>
      <PostHistoryTemplate />
    </CommonPageLayout>
  )
}

export default PostHistoryPage
