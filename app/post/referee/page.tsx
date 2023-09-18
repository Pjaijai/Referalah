import React from "react"
import RefereePostPageTemplate from "@/modules/post/referee/template"

import SearchPageLayout from "@/components/layouts/search-page"

const RefereePostPage = () => {
  return (
    <SearchPageLayout title="工作(受薦區)">
      <RefereePostPageTemplate />
    </SearchPageLayout>
  )
}

export default RefereePostPage
