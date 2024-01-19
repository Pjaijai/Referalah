"use client"

import React from "react"
import { ContributedArea } from "@/modules/contributors/types/contributed-area"
import { useI18n } from "@/utils/services/internationalization/client"

import { Badge } from "@/components/ui/badge"

interface IContributionAreaBadgeProps {
  area: ContributedArea
}
const ContributionAreaBadge: React.FunctionComponent<
  IContributionAreaBadgeProps
> = ({ area }) => {
  const t = useI18n()
  const getContributionAreaText = (area: ContributedArea) => {
    const mapper: Record<ContributedArea, string> = {
      software_development: t("contribution.type.software_development"),
      uiux_design: t("contribution.type.uiux_design"),
      marketing: t("contribution.type.marketing"),
      graphic_design: t("contribution.type.graphic_design"),
      administration: t("contribution.type.administration"),
    }

    const text = mapper[area]

    return text
  }
  const text = getContributionAreaText(area)
  return <Badge>{text}</Badge>
}

export default ContributionAreaBadge
