import React from "react"

import { cn } from "@/lib/utils"

type TSubSectionProps = {
  title: string
  children: React.ReactNode
  className?: string
}
const SubSection = ({ children, title, className }: TSubSectionProps) => {
  return (
    <div className={cn("flex w-full min-w-max flex-row ", className)}>
      <div className="hidden basis-2/12 text-lg font-semibold text-slate-700 md:block">
        {title}
      </div>

      <div className=" w-full md:w-fit  md:basis-8/12">{children}</div>
    </div>
  )
}

export default SubSection
