import React from "react"

import { IListPostResponse } from "@/types/api/response/referer-post"
import ReferralPostCard from "@/components/customized-ui/cards/referral-post"

interface IPostHistoryTemplateProps {
  data?: IListPostResponse[]
  isLoading: boolean
}
const PostHistoryTemplate: React.FunctionComponent<
  IPostHistoryTemplateProps
> = ({ data }) => {
  if (!data) return <div>{<ReferralPostCard />}</div>
}

export default PostHistoryTemplate
