import React from "react"
import Link from "next/link"
import ContributionAreaBadge from "@/modules/contributors/components/contribution-area-badge"
import { IContributor } from "@/modules/contributors/types/contributor"

import { Badge } from "@/components/ui/badge"
import { Card, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface IContributorCard extends IContributor {}

const ContributorCard: React.FunctionComponent<IContributorCard> = ({
  contributedArea,
  links,
  name,
  isActive,
}) => {
  return (
    <Card className="flex flex-col gap-2 border p-4">
      <div className="flex flex-row items-center justify-start gap-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>

        <div className="flex flex-row gap-2">
          {links.github && (
            <Link href={links.github}>
              <Icons.github />
            </Link>
          )}
          {links.linkedin && (
            <Link href={links.linkedin}>
              <Icons.linkedin />
            </Link>
          )}
          {links.instagram && (
            <Link href={links.instagram}>
              <Icons.instagram />
            </Link>
          )}
          {links.website && (
            <Link href={links.website}>
              <Icons.laptop />
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-row gap-2">
        {contributedArea.map((data) => (
          <ContributionAreaBadge area={data} key={data} />
        ))}
        {isActive && <Badge variant={"purple"}>Active !</Badge>}
      </div>
    </Card>
  )
}

export default ContributorCard
