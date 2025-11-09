import CreatePostTemplate from "@/modules/post/create/template"
import { getIndustryList, getLocationList } from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"
import AuthenticatedPageWrapper from "@/components/wrappers/authenticated/authenticated"

export const metadata = siteConfig.page.createPost.metadata

export const revalidate = 60 * 60 * 24

const CreatePostPage = async () => {
  const t = await getI18n()
  const [locationList, industryList] = await Promise.all([
    getLocationList(),
    getIndustryList(),
  ])
  return (
    <AuthenticatedPageWrapper>
      <CommonPageLayout title={t("page.create_post")}>
        <CreatePostTemplate
          locationList={locationList}
          industryList={industryList}
        />
      </CommonPageLayout>
    </AuthenticatedPageWrapper>
  )
}

export default CreatePostPage
