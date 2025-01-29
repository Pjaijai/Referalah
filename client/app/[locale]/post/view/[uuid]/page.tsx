import React from "react"
import ReferralPostDetailsPageTemplate from "@/modules/post/view/template"
import {
  getPostByUuid,
  getPostViewCountByUuid,
  incrementPostViewCountByUuid,
} from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import { EPostType } from "@/types/common/post-type"
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
    case EPostType.HIRING:
      typeTitle = t("post.type.hiring.title")
      break
    case EPostType.REFEREE:
      typeTitle = t("post.type.referee.title")
      break
    case EPostType.REFERRER:
      typeTitle = t("post.type.referer.title")
      break
    case EPostType.COLLABORATION:
      typeTitle = t("post.type.collaboration.title")
      break
    default:
      break
  }

  return {
    title: `${jobTitle} | ${typeTitle} | ${t("page.post")}`,
  }
}

const RefererPostDetailsPage = async ({
  params,
}: {
  params: { uuid: string }
}) => {
  await incrementPostViewCountByUuid(params.uuid)
  const viewCount = await getPostViewCountByUuid(params.uuid)

  return (
    <CommonPageLayout>
      <ReferralPostDetailsPageTemplate
        postUuid={params.uuid}
        viewCount={viewCount}
      />
    </CommonPageLayout>
  )
}

export default RefererPostDetailsPage
