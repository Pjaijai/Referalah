import React, { ReactNode } from "react"

interface IInfoCardProps {
  children: ReactNode
}
const InfoCard: React.FunctionComponent<IInfoCardProps> = ({ children }) => {
  return (
    <div className="flex h-fit w-fit min-w-[8rem]  flex-col items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-6 py-2 dark:border-muted-foreground dark:bg-black">
      {children}
    </div>
  )
}

export default InfoCard
