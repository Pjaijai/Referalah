import React from "react"
import EditPostPageTemplate from "@/modules/post/edit/template"
import { getIndustryList, getLocationList } from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import CommonPageLayout from "@/components/layouts/common"

export const revalidate = 60 * 60 * 24

const EditPostPage = async ({ params }: { params: { postUuid: string } }) => {
  const t = await getI18n()
  const [locationList, industryList] = await Promise.all([
    getLocationList(),
    getIndustryList(),
  ])

  return (
    <CommonPageLayout title={t("page.edit_post")}>
      <EditPostPageTemplate
        postUuid={params.postUuid}
        locationList={locationList}
        industryList={industryList}
      />
    </CommonPageLayout>
  )
}

export default EditPostPage
