"use client"

import React from "react"
import { NextPage } from "next"
import CommonPageLayout from "@/components/layouts/common"
import RefereePageTemplate from "@/modules/referral/referee/template"

const RefereePage: NextPage = () => {
  return (
    <CommonPageLayout title="受薦人">
      <RefereePageTemplate />
    </CommonPageLayout>
  )
}

export default RefereePage
