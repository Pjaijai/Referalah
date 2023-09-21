import React from "react"
import SearchPageLayout from "@/components/layouts/search-page"
import RefererPostPageTemplate from "@/modules/post/referer/template"

const RefererPostPage = () => {
  return (
    <SearchPageLayout title="工作(推薦區)">
      <RefererPostPageTemplate />
    </SearchPageLayout>
  )
}

export default RefererPostPage
