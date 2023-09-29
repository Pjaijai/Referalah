"use client"

import React from "react"
import { NextPage } from "next"
import SearchPageLayout from "@/components/layouts/search-page"
import RefereePageTemplate from "@/modules/referral/referee/template"

const RefereePage: NextPage = () => {
  return (
    <SearchPageLayout title="受薦人">
      <RefereePageTemplate />
    </SearchPageLayout>
  )
}

export default RefereePage
