import React from "react"

import { Badge } from "@/components/ui/badge"
import { ContributedArea } from "@/app/contributors/types/ contributed-area"
import getContributionAreaText from "@/app/contributors/uilts/get-contribution-area-text"

interface IContributionAreaBadgeProps {
  area: ContributedArea
}
const ContributionAreaBadge: React.FunctionComponent<
  IContributionAreaBadgeProps
> = ({ area }) => {
  const text = getContributionAreaText(area)
  return <Badge>{text}</Badge>
}

export default ContributionAreaBadge
