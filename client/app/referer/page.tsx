"use client"

import React from "react"
import { NextPage } from "next"
import CommonPageLayout from "@/components/layouts/common"
import RefererPageTemplate from "@/modules/referral/referer/template"

const RefererPage: NextPage = () => {
  return (
    <CommonPageLayout title="推薦人">
      <RefererPageTemplate />
    </CommonPageLayout>
  )
}

export default RefererPage
