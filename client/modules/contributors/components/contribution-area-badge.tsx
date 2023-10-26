import React from "react"
import { ContributedArea } from "@/modules/contributors/types/contributed-area"
import getContributionAreaText from "@/modules/contributors/uilts/get-contribution-area-text"

import { Badge } from "@/components/ui/badge"

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
