"use client"

import React from "react"
import EditPostPageTemplate from "@/modules/post/edit/template"

import useGetPost from "@/hooks/api/post/get-post"
import CommonPageLayout from "@/components/layouts/common"

const EditPostPage = ({ params }: { params: { postUuid: string } }) => {
  const { data: post, isLoading, isSuccess } = useGetPost(params.postUuid)

  return (
    <CommonPageLayout>
      <EditPostPageTemplate postDate={post} isPostDataLoading={isLoading} />
    </CommonPageLayout>
  )
}

export default EditPostPage
