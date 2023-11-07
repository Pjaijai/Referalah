"use client"

import React from "react"
import PostHistoryTemplate from "@/modules/post/history/template"
import { getUserProfile } from "@/utils/common/api"

import { siteConfig } from "@/config/site"
import useGetPostListByUserUuid from "@/hooks/api/post/get-post-list-by-user-uuid"
import useUserStore from "@/hooks/state/user/store"
import CommonPageLayout from "@/components/layouts/common"

export async function generateMetadata({
  params,
}: {
  params: { userUuid: string }
}) {
  const { userUuid } = params
  try {
    const res = await getUserProfile({ queryKey: [, { userUuid }] })
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

const PostHistoryPage = ({ params }: { params: { userUuid: string } }) => {
  const { data, isLoading } = useGetPostListByUserUuid(params.userUuid)
  const userUuid = useUserStore((state) => state.uuid)
  const isViewingOwnProfile = params.userUuid === userUuid

  return (
    <CommonPageLayout title={siteConfig.page.postHistory.name}>
      <PostHistoryTemplate
        data={data}
        isLoading={isLoading}
        isViewingOwnProfile={isViewingOwnProfile}
      />
    </CommonPageLayout>
  )
}

export default PostHistoryPage
