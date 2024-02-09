import React, { PropsWithChildren } from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface IYearsOfExperienceDisplayProps {
  yearOfExperience: number
  className?: string
}

const YearsOfExperienceDisplay: React.FunctionComponent<
  PropsWithChildren<IYearsOfExperienceDisplayProps>
> = ({ yearOfExperience, className }) => {
  const t = useI18n()
  return (
    <div className={cn("flex items-center justify-start", className)}>
      <div>
        <Icons.yearsOfExperience width="18" height="18" />
      </div>
      <span className="ml-1">
        {t("general.year_of_experience_count", {
          count: yearOfExperience ?? 0,
        })}
      </span>
    </div>
  )
}

export default YearsOfExperienceDisplay
