import RefererPostPageTemplate from "@/modules/post/referer/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.referrerPost.metadata

const RefererPostPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.referrerPost.name}>
      <RefererPostPageTemplate />
    </CommonPageLayout>
  )
}

export default RefererPostPage
