"use client"

import React from "react"
import PostHistoryTemplate from "@/modules/post/history/template"

import { siteConfig } from "@/config/site"
import useGetPostListByUserUuid from "@/hooks/api/post/get-post-list-by-user-uuid"
import useUserStore from "@/hooks/state/user/store"
import CommonPageLayout from "@/components/layouts/common"

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
