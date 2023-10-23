import React from "react"
import Link from "next/link"

import { Icons } from "@/components/icons"
import ContributionAreaBadge from "@/app/contributors/components/contribution-area-badge"
import { IContributor } from "@/app/contributors/types/contributor"

interface IContributorCard extends IContributor {}
const ContributorCard: React.FunctionComponent<IContributorCard> = ({
  contributedArea,
  links,
  name,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-start gap-2">
        <h2 className="text-lg font-semibold">{name}</h2>
        <div className="flex flex-row gap-2">
          {contributedArea.map((data, index) => (
            <ContributionAreaBadge area={data} key={index} />
          ))}
        </div>
      </div>

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
      </div>
    </div>
  )
}

export default ContributorCard
