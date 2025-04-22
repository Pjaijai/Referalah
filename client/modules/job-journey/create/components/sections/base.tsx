import React from "react"

const BaseSection = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-white p-10">{children}</div>
}

export default BaseSection
