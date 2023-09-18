"use client"

import React from "react"
import { NextPage } from "next"
import RefereePageTemplate from "@/modules/referral/referee/template"

import SearchPageLayout from "@/components/layouts/search-page"

const RefereePage: NextPage = () => {
  return (
    <SearchPageLayout title="搵受薦人">
      <RefereePageTemplate />
    </SearchPageLayout>
  )
}

export default RefereePage
