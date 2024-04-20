import React from "react"
import PostSearchPageTemplate from "@/modules/post/search/template"
import {
  getCityList,
  getCountryList,
  getIndustryList,
  getProvinceList,
} from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.searchPost.metadata

const PostSearchPage = async () => {
  const t = await getI18n()
  const countryList = await getCountryList()
  const provinceList = await getProvinceList()
  const cityList = await getCityList()
  const industryList = await getIndustryList()
  return (
    <CommonPageLayout title={t("page.post")}>
      <PostSearchPageTemplate
        countryList={countryList}
        provinceList={provinceList}
        cityList={cityList}
        industryList={industryList}
      />
    </CommonPageLayout>
  )
}

export default PostSearchPage
