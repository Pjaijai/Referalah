import React from "react"
import RefererPostPageTemplate from "@/modules/post/referer/template"

import SearchPageLayout from "@/components/layouts/search-page"

const RefererPostPage = () => {
  return (
    <SearchPageLayout title="工作(推薦區)">
      <RefererPostPageTemplate />
    </SearchPageLayout>
  )
}

export default RefererPostPage
