import React from "react"

import ReferralPostCard from "@/components/customized-ui/cards/referral-post"

interface IPostHistoryTemplateProps {
  data: any
}
const PostHistoryTemplate: React.FunctionComponent<
  IPostHistoryTemplateProps
> = ({ data }) => {
  return <div>{<ReferralPostCard />}</div>
}

export default PostHistoryTemplate
