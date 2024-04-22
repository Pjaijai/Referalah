import React from "react"
import EditPostPageTemplate from "@/modules/post/edit/template"
import {
  getCityList,
  getCountryList,
  getIndustryList,
  getProvinceList,
} from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import CommonPageLayout from "@/components/layouts/common"

export const revalidate = 60 * 60 * 24

const EditPostPage = async ({ params }: { params: { postUuid: string } }) => {
  const t = await getI18n()
  const countryList = await getCountryList()
  const provinceList = await getProvinceList()
  const cityList = await getCityList()
  const industryList = await getIndustryList()

  return (
    <CommonPageLayout title={t("page.edit_post")}>
      <EditPostPageTemplate
        postUuid={params.postUuid}
        cityList={cityList}
        countryList={countryList}
        industryList={industryList}
        provinceList={provinceList}
      />
    </CommonPageLayout>
  )
}

export default EditPostPage
