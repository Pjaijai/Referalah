import React from "react"
import ReferralPostDetailsPageTemplate from "@/modules/post/view/template"
import { getPostByUuid } from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import CommonPageLayout from "@/components/layouts/common"

export async function generateMetadata({
  params,
}: {
  params: { uuid: string }
}) {
  const { uuid } = params
  const t = await getI18n()
  const res = await getPostByUuid(uuid)
  return {
    title: `${res.job_title} | ${t("page.post")}`,
  }
}

export const fetchCache = "default-cache"

const RefererPostDetailsPage = ({ params }: { params: { uuid: string } }) => {
  return (
    <CommonPageLayout>
      <ReferralPostDetailsPageTemplate postUuid={params.uuid} />
    </CommonPageLayout>
  )
}

export default RefererPostDetailsPage
