import React, { PropsWithChildren } from "react"

import { Icons } from "@/components/icons"

interface IYearsOfExperienceDisplayProps {
  yearOfExperience: number | null
}
const YearsOfExperienceDisplay: React.FunctionComponent<
  PropsWithChildren<IYearsOfExperienceDisplayProps>
> = ({ yearOfExperience }) => {
  return (
    <div className="flex justify-start">
      <Icons.yearsOfExperience width="18" />
      <span className="ml-1">{yearOfExperience}年經驗</span>
    </div>
  )
}

export default YearsOfExperienceDisplay
