import React, { PropsWithChildren } from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

// TODO: Remove
interface ICompanyNameDisplayProps {
  name: string
  className?: string
}
const CompanyNameDisplay: React.FunctionComponent<
  PropsWithChildren<ICompanyNameDisplayProps>
> = ({ name, className }) => {
  return (
    <div
      className={(cn("inline-block text-sm text-muted-foreground"), className)}
    >
      <Icons.company width="13" height="13" className="inline align-middle" />
      <span className="ml-1">{name}</span>
    </div>
  )
}

export default CompanyNameDisplay
