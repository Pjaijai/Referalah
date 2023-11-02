"use client"

import React from "react"
import PostHistoryTemplate from "@/modules/post/history/template"

import useListPostByUserUuid from "@/hooks/api/post/list-post-by-user-uuid"
import CommonPageLayout from "@/components/layouts/common"

const PostHistoryPage = ({ params }: { params: { userUuid: string } }) => {
  const { data } = useListPostByUserUuid(params.userUuid)

  return (
    <CommonPageLayout>
      <PostHistoryTemplate data={data} />
    </CommonPageLayout>
  )
}

export default PostHistoryPage
