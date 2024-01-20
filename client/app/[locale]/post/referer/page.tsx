import RefererPostPageTemplate from "@/modules/post/referer/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.referrerPost.metadata

const RefererPostPage = async () => {
  const t = await getI18n()
  return (
    <CommonPageLayout title={t("page.post")}>
      <RefererPostPageTemplate />
    </CommonPageLayout>
  )
}

export default RefererPostPage
