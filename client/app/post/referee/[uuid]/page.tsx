import React from "react"
import ReferralPostDetailsPageTemplate from "@/modules/post/view/template"

import { ReferralType } from "@/types/common/referral-type"

const RefereePostDetailsPage = ({ params }: { params: { uuid: string } }) => {
  return (
    <ReferralPostDetailsPageTemplate
      postUuid={params.uuid}
      referralType={ReferralType.REFEREE}
    />
  )
}

export default RefereePostDetailsPage
