"use client"

import React from "react"
import { NextPage } from "next"
import RefererPageTemplate from "@/modules/referral/referer/template"

import { siteConfig } from "@/config/site"
import CommonPageLayout from "@/components/layouts/common"

const RefererPage: NextPage = () => {
  return (
    <CommonPageLayout title={siteConfig.page.referrer.name}>
      <RefererPageTemplate />
    </CommonPageLayout>
  )
}

export default RefererPage
