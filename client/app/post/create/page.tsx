import CreatePostTemplate from "@/modules/post/create/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.createPost.metadata

const CreatePostPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.createPost.name}>
      <CreatePostTemplate />
    </CommonPageLayout>
  )
}

export default CreatePostPage
