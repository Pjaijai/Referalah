import React, { PropsWithChildren } from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface IYearsOfExperienceDisplayProps {
  yearOfExperience: number | null
  className?: string
}

const YearsOfExperienceDisplay: React.FunctionComponent<
  PropsWithChildren<IYearsOfExperienceDisplayProps>
> = ({ yearOfExperience, className }) => {
  return (
    <div className={cn("flex items-center justify-start", className)}>
      <div>
        <Icons.yearsOfExperience width="18" height="18" />
      </div>
      <span className="ml-1">{yearOfExperience}年經驗</span>
    </div>
  )
}

export default YearsOfExperienceDisplay
