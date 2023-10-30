import React from "react"
import ReferralPostDetailsPageTemplate from "@/modules/post/view/template"

const RefererPostDetailsPage = ({ params }: { params: { uuid: string } }) => {
  return <ReferralPostDetailsPageTemplate postUuid={params.uuid} />
}

export default RefererPostDetailsPage
