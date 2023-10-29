import React from "react"
import ReferralPostDetailsPageTemplate from "@/modules/post/view/template"

import { ReferralType } from "@/types/common/referral-type"

const RefereePostDetailsPage = ({ params }: { params: { postId: string } }) => {
  return (
    <ReferralPostDetailsPageTemplate
      postId={params.postId}
      referralType={ReferralType.REFEREE}
    />
  )
}

export default RefereePostDetailsPage
