import React from "react"
import PostSearchPageTemplate from "@/modules/post/search/template"
import { getIndustryList, getLocationList } from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.searchPost.metadata

export const revalidate = 60 * 60 * 24

const PostSearchPage = async () => {
  const t = await getI18n()
  const locationList = await getLocationList()
  const industryList = await getIndustryList()
  return (
    <CommonPageLayout title={t("page.post")}>
      <PostSearchPageTemplate
        locationList={locationList}
        industryList={industryList}
      />
    </CommonPageLayout>
  )
}

export default PostSearchPage
