import React, { PropsWithChildren } from "react"

interface CommonPageLayout {
  title?: string
}
const CommonPageLayout: React.FunctionComponent<
  PropsWithChildren<CommonPageLayout>
> = ({ title, children }) => {
  return (
    <div className="mt-4 h-full w-full">
      {title && <h1 className=" text-center text-2xl font-bold">{title}</h1>}
      <>{children}</>
    </div>
  )
}

export default CommonPageLayout
