import React from "react"
import ReferralPostDetailsPageTemplate from "@/modules/post/view/template"

import { ReferralType } from "@/types/common/referral-type"

const RefererPostDetailsPage = ({ params }: { params: { postId: string } }) => {
  return (
    <ReferralPostDetailsPageTemplate
      postId={params.postId}
      referralType={ReferralType.REFERRER}
    />
  )
}

export default RefererPostDetailsPage
