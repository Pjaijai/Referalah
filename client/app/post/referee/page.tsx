import React from "react"
import RefereePostPageTemplate from "@/modules/post/referee/template"

import SearchPageLayout from "@/components/layouts/search-page"

const RefereePostPage = () => {
  return (
    <SearchPageLayout title="人搵工">
      <RefereePostPageTemplate />
    </SearchPageLayout>
  )
}

export default RefereePostPage
