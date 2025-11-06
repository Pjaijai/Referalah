import React from "react"
import EditProfileTemplate from "@/modules/profile/edit/template"
import { getIndustryList, getLocationList } from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import CommonPageLayout from "@/components/layouts/common"
import AuthenticatedPageWrapper from "@/components/wrappers/authenticated/authenticated"

export const revalidate = 60 * 60 * 24

const EditProfilePage = async () => {
  const locationList = await getLocationList()
  const industryList = await getIndustryList()
  const t = await getI18n()
  return (
    <AuthenticatedPageWrapper>
      <CommonPageLayout title={t("page.edit_profile")}>
        <EditProfileTemplate
          locationList={locationList}
          industryList={industryList}
        />
      </CommonPageLayout>
    </AuthenticatedPageWrapper>
  )
}

export default EditProfilePage
