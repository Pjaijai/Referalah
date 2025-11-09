import MemberSearchPageTemplate from "@/modules/member/search/template"
import { getIndustryList, getLocationList } from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export const metadata = {
  ...siteConfig.page.searchMember.metadata,
  robots: "index, follow",
}

export const revalidate = 60 * 60 * 24

export default async function MemberSearchPage() {
  const t = await getI18n()
  const locationList = await getLocationList()
  const industryList = await getIndustryList()

  return (
    <CommonPageLayout title={t("page.search_member")}>
      <MemberSearchPageTemplate
        locationList={locationList}
        industryList={industryList}
      />
    </CommonPageLayout>
  )
}
