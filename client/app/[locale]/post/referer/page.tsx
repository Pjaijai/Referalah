import RefererPostPageTemplate from "@/modules/post/referer/template"
import {
  getCityList,
  getCountryList,
  getIndustryList,
  getProvinceList,
} from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.referrerPost.metadata

export const revalidate = false
export const fetchCache = "default-cache"

const RefererPostPage = async () => {
  const t = await getI18n()
  const countryList = await getCountryList()
  const provinceList = await getProvinceList()
  const cityList = await getCityList()
  const industryList = await getIndustryList()
  return (
    <CommonPageLayout title={t("page.post")}>
      <RefererPostPageTemplate
        countryList={countryList}
        provinceList={provinceList}
        cityList={cityList}
        industryList={industryList}
      />
    </CommonPageLayout>
  )
}

export default RefererPostPage
