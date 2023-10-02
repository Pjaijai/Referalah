"use client"

import React from "react"
import { NextPage } from "next"
import SearchPageLayout from "@/components/layouts/search-page"
import RefererPageTemplate from "@/modules/referral/referer/template"

const RefererPage: NextPage = () => {
  return (
    <SearchPageLayout title="推薦人">
      <RefererPageTemplate />
    </SearchPageLayout>
  )
}

export default RefererPage
