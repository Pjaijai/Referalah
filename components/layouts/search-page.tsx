import React, { PropsWithChildren } from "react"

interface SearchPageLayout {
  title: string
}
const SearchPageLayout: React.FunctionComponent<
  PropsWithChildren<SearchPageLayout>
> = ({ title, children }) => {
  return (
    <div className="w-full h-ull">
      <h1 className="text-center font-bold mt-4 text-2xl">{title}</h1>
      {children}
    </div>
  )
}

export default SearchPageLayout
