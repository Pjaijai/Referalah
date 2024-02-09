"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import EditPostPageTemplate from "@/modules/post/edit/template"
import { useI18n } from "@/utils/services/internationalization/client"

import { siteConfig } from "@/config/site"
import useGetPost from "@/hooks/api/post/get-post"
import useUserStore from "@/hooks/state/user/store"
import CommonPageLayout from "@/components/layouts/common"

const EditPostPage = ({ params }: { params: { postUuid: string } }) => {
  const t = useI18n()
  const { data: post, isLoading } = useGetPost(params.postUuid)
  const userUuid = useUserStore((state) => state.uuid)
  const router = useRouter()

  // If not sign in and not viewing by same user
  useEffect(() => {
    if (!isLoading && post?.user?.uuid !== userUuid) {
      router.push(siteConfig.page.main.href)
    }
  }, [isLoading, post, router, userUuid])

  return (
    <CommonPageLayout title={t("page.edit_post")}>
      {!isLoading && (
        <EditPostPageTemplate
          postDate={post}
          isPostDataLoading={isLoading}
          postUuid={params.postUuid}
        />
      )}
    </CommonPageLayout>
  )
}

export default EditPostPage
