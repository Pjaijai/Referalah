import React from "react"
import ReferralPostDetailsPageTemplate from "@/modules/post/view/template"
import { getPostByUuid } from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import { EReferralType } from "@/types/common/referral-type"
import CommonPageLayout from "@/components/layouts/common"

export async function generateMetadata({
  params,
}: {
  params: { uuid: string }
}) {
  const { uuid } = params

  // Fetch internationalization function
  const t = await getI18n()

  // Fetch post data
  const { type: postType, job_title: jobTitle } = await getPostByUuid(uuid)

  // Define type title based on post type
  let typeTitle: string = ""
  switch (postType) {
    case EReferralType.HIRING:
      typeTitle = t("post.type.hiring.title")
      break
    case EReferralType.REFEREE:
      typeTitle = t("post.type.referee.title")
      break
    case EReferralType.REFERRER:
      typeTitle = t("post.type.referer.title")
      break
    default:
      break
  }

  return {
    title: `${jobTitle} | ${typeTitle} | ${t("page.post")}`,
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
