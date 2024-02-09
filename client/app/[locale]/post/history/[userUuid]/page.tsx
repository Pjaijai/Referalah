import React from "react"
import PostHistoryTemplate from "@/modules/post/history/template"
import { getUserProfile } from "@/utils/common/api"
import { getI18n } from "@/utils/services/internationalization/server"

import CommonPageLayout from "@/components/layouts/common"

export async function generateMetadata({
  params,
}: {
  params: { userUuid: string }
}) {
  const { userUuid } = params
  try {
    const res = await getUserProfile(userUuid)
    return {
      title: res.username + "街招記錄",
    }
  } catch (e) {
    return {
      title: "街招記錄",
      description: "街招記錄",
    }
  }
}

const PostHistoryPage = async ({
  params,
}: {
  params: { userUuid: string }
}) => {
  const t = await getI18n()
  return (
    <CommonPageLayout title={t("page.post_history")}>
      <PostHistoryTemplate slug={params.userUuid} />
    </CommonPageLayout>
  )
}

export default PostHistoryPage
