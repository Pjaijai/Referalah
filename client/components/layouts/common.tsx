import React, { PropsWithChildren } from "react"

interface CommonPageLayout {
  title: string
}
const CommonPageLayout: React.FunctionComponent<
  PropsWithChildren<CommonPageLayout>
> = ({ title, children }) => {
  return (
    <div className="h-full w-full">
      <h1 className="mt-4 text-center text-2xl font-bold">{title}</h1>
      {children}
    </div>
  )
}

export default CommonPageLayout
