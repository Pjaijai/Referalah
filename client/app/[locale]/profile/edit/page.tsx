import React from "react"
import EditProfileTemplate from "@/modules/profile/edit/template"
import {
  getCityList,
  getCountryList,
  getIndustryList,
  getProvinceList,
} from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import CommonPageLayout from "@/components/layouts/common"
import AuthenticatedPageWrapper from "@/components/wrappers/authenticated/authenticated"

export const revalidate = 60 * 60 * 24

const EditProfilePage = async () => {
  const countryList = await getCountryList()
  const provinceList = await getProvinceList()
  const cityList = await getCityList()
  const industryList = await getIndustryList()
  const t = await getI18n()
  return (
    <AuthenticatedPageWrapper>
      <CommonPageLayout>
        <EditProfileTemplate
          cityList={cityList}
          countryList={countryList}
          industryList={industryList}
          provinceList={provinceList}
        />
      </CommonPageLayout>
    </AuthenticatedPageWrapper>
  )
}

export default EditProfilePage
