import CreatePostTemplate from "@/modules/post/create/template"

import { siteConfig } from "@/config/site"
import AuthenticatedPageLayout from "@/components/layouts/authenticated"
import CommonPageLayout from "@/components/layouts/common"

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
