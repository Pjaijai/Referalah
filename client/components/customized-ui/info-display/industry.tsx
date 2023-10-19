import React, { PropsWithChildren } from "react"

import { Icons } from "@/components/icons"

interface IIndustryDisplayProps {
  industry: string | null
}
const IndustryDisplay: React.FunctionComponent<
  PropsWithChildren<IIndustryDisplayProps>
> = ({ industry }) => {
  return (
    <div className="flex items-center justify-start">
      <Icons.industry width="18" />
      <span className="ml-1">{industry}</span>
    </div>
  )
}

export default IndustryDisplay
