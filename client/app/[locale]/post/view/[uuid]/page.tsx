import React from "react"
import ReferralPostDetailsPageTemplate from "@/modules/post/view/template"
import {
  getLocationList,
  getPostByUuid,
  getPostViewCountByUuid,
  incrementPostViewCountByUuid,
} from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import { EPostType } from "@/types/common/post-type"
import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

export async function generateMetadata({
  params,
}: {
  params: { locale: string; uuid: string }
}) {
  const { uuid } = params

  // Fetch internationalization function
  const t = await getI18n()

  // Fetch post data
  const {
    type: postType,
    job_title: jobTitle,
    description,
  } = await getPostByUuid(uuid)

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

  const title = `${jobTitle} | ${typeTitle} | ${t("page.post")}`

  return {
    title: title,
    description: description,
    robots: "index, follow",
    openGraph: {
      ...siteConfig.defaultMetaData.openGraph,
      locale: params.locale,
      url: `${process.env.NEXT_PUBLIC_WEB_URL}${params.locale}/${siteConfig.page.viewPost.href}/${params.uuid}`,
      title: title,
      description: description,
    },
    twitter: {
      ...siteConfig.defaultMetaData.twitter,
      title: title,
      description: description,
    },
  }
}

const RefererPostDetailsPage = async ({
  params,
}: {
  params: { uuid: string }
}) => {
  await incrementPostViewCountByUuid(params.uuid)
  const [viewCount, locationList] = await Promise.all([
    getPostViewCountByUuid(params.uuid),
    getLocationList(),
  ])

  return (
    <CommonPageLayout>
      <ReferralPostDetailsPageTemplate
        postUuid={params.uuid}
        viewCount={viewCount}
        locationList={locationList}
      />
    </CommonPageLayout>
  )
}

export default RefererPostDetailsPage
