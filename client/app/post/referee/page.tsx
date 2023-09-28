import React from "react"
import SearchPageLayout from "@/components/layouts/search-page"
import RefereePostPageTemplate from "@/modules/post/referee/template"

const RefereePostPage = () => {
  return (
    <SearchPageLayout title="人搵工">
      <RefereePostPageTemplate />
    </SearchPageLayout>
  )
}

export default RefereePostPage
