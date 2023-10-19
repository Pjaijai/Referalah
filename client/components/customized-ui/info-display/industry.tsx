import React, { PropsWithChildren } from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface IIndustryDisplayProps {
  industry: string | null
  className?: string
}
const IndustryDisplay: React.FunctionComponent<
  PropsWithChildren<IIndustryDisplayProps>
> = ({ industry, className }) => {
  return (
    <div className={cn("flex items-center justify-start", className)}>
      <div>
        <Icons.industry width="18" height="18" />
      </div>
      <span className="ml-1">{industry}</span>
    </div>
  )
}

export default IndustryDisplay
