import CreatePostTemplate from "@/modules/post/create/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"
import AuthenticatedPageLayout from "@/components/wrappers/authenticated"

export const metadata = siteConfig.page.createPost.metadata

const CreatePostPage = () => {
  return (
    <AuthenticatedPageLayout>
      <CommonPageLayout title={siteConfig.page.createPost.name}>
        <CreatePostTemplate />
      </CommonPageLayout>
    </AuthenticatedPageLayout>
  )
}

export default CreatePostPage
