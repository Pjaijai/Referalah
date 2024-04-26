import UserSearchPageTemplate from "@/modules/referral/search/template"
import {
  getCityList,
  getCountryList,
  getIndustryList,
  getProvinceList,
} from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

// TODO
// export const metadata = siteConfig.page.referrer.metadata

export const revalidate = 60 * 60 * 24

export default async function MemberSearchPage() {
  const t = await getI18n()
  const countryList = await getCountryList()
  const provinceList = await getProvinceList()
  const cityList = await getCityList()
  const industryList = await getIndustryList()

  // TODO title
  return (
    <CommonPageLayout title={t("page.search_member")}>
      <UserSearchPageTemplate
        cityList={cityList}
        provinceList={provinceList}
        industryList={industryList}
        countryList={countryList}
      />
    </CommonPageLayout>
  )
}
