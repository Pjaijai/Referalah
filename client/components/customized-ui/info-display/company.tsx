import React, { PropsWithChildren } from "react"

import { Icons } from "@/components/icons"

interface ICompanyNameDisplayProps {
  name: string
}
const CompanyNameDisplay: React.FunctionComponent<
  PropsWithChildren<ICompanyNameDisplayProps>
> = ({ name }) => {
  return (
    <div className="flex justify-start items-center text-sm text-muted-foreground">
      <Icons.company width="13" />
      <span className="ml-1">{name}</span>
    </div>
  )
}

export default CompanyNameDisplay
