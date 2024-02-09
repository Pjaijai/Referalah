import CreatePostTemplate from "@/modules/post/create/template"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"
import AuthenticatedPageWrapper from "@/components/wrappers/authenticated"

export const metadata = siteConfig.page.createPost.metadata

const CreatePostPage = async () => {
  const t = await getI18n()
  return (
    <AuthenticatedPageWrapper>
      <CommonPageLayout title={t("page.create_post")}>
        <CreatePostTemplate />
      </CommonPageLayout>
    </AuthenticatedPageWrapper>
  )
}

export default CreatePostPage
