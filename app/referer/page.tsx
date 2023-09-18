"use client"

import React from "react"
import { NextPage } from "next"
import RefererPageTemplate from "@/modules/referral/referer/template"

import SearchPageLayout from "@/components/layouts/search-page"

const RefererPage: NextPage = () => {
  return (
    <SearchPageLayout title="搵推薦人">
      <RefererPageTemplate />
    </SearchPageLayout>
  )
}

export default RefererPage
