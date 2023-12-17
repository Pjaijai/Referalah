import CreatePostTemplate from "@/modules/post/create/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"
import AuthenticatedPageWrapper from "@/components/wrappers/authenticated"

export const metadata = siteConfig.page.createPost.metadata

export const metadata = siteConfig.page.createPost.metadata

const CreatePostPage = () => {
  return (
    <AuthenticatedPageWrapper>
      <CommonPageLayout title={siteConfig.page.createPost.name}>
        <CreatePostTemplate />
      </CommonPageLayout>
    </AuthenticatedPageWrapper>
  )
}

export default CreatePostPage
