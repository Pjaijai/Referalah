import React from "react"
import ReferralPostDetailsPageTemplate from "@/modules/post/view/template"

import CommonPageLayout from "@/components/layouts/common"

const RefererPostDetailsPage = ({ params }: { params: { uuid: string } }) => {
  return (
    <CommonPageLayout>
      <ReferralPostDetailsPageTemplate postUuid={params.uuid} />
    </CommonPageLayout>
  )
}

export default RefererPostDetailsPage
