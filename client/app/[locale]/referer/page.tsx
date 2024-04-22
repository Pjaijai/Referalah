import RefererPageTemplate from "@/modules/referral/referer/template"
import {
  getCityList,
  getCountryList,
  getIndustryList,
  getProvinceList,
} from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = siteConfig.page.referrer.metadata

export const revalidate = 60 * 60 * 24

export default async function RefererPage() {
  const t = await getI18n()
  const countryList = await getCountryList()
  const provinceList = await getProvinceList()
  const cityList = await getCityList()
  const industryList = await getIndustryList()

  return (
    <CommonPageLayout title={t("page.referrer")}>
      <RefererPageTemplate
        cityList={cityList}
        provinceList={provinceList}
        industryList={industryList}
        countryList={countryList}
      />
    </CommonPageLayout>
  )
}
