"use client"

import React from "react"
import { NextPage } from "next"
import RefereePageTemplate from "@/modules/referral/referee/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

const RefereePage: NextPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.referee.name}>
      <RefereePageTemplate />
    </CommonPageLayout>
  )
}

export default RefereePage
