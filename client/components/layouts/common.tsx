import React, { PropsWithChildren } from "react"

interface CommonPageLayout {
  title?: string
}
const CommonPageLayout: React.FunctionComponent<
  PropsWithChildren<CommonPageLayout>
> = ({ title, children }) => {
  return (
    <div className="container mt-4 h-full w-full">
      {title && <h1 className="mb-2 text-left text-3xl font-bold">{title}</h1>}

      <>{children}</>
    </div>
  )
}

export default CommonPageLayout
