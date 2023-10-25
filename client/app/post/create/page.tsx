"use client"

import React from "react"
import CreatePostTemplate from "@/modules/post/create/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

const CreatePostPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.createPost.name}>
      <CreatePostTemplate />
    </CommonPageLayout>
  )
}

export default CreatePostPage
