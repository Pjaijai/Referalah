import React, { PropsWithChildren } from "react"

interface ICommonPageLayout {
  title: string
}
const CommonPageLayout: React.FunctionComponent<
  PropsWithChildren<ICommonPageLayout>
> = ({ title, children }) => {
  return (
    <div className="w-full h-full">
      <h1 className="text-center font-bold mt-4 text-2xl">{title}</h1>
      {children}
    </div>
  )
}

export default CommonPageLayout
