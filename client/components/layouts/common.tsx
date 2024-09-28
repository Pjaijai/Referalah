"use client"

import React, { PropsWithChildren } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface CommonPageLayout {
  title?: string
}
const CommonPageLayout: React.FunctionComponent<
  PropsWithChildren<CommonPageLayout>
> = ({ title, children }) => {
  const pathname = usePathname()
  const isMainPage = () => {
    const localePrefixes = ["/zh-hk", "/ca-en"]

    const pathWithoutLocale = localePrefixes.reduce(
      (path, prefix) => path.replace(prefix, ""),
      pathname
    )

    return pathWithoutLocale === "/" || pathWithoutLocale === ""
  }

  return (
    <div
      className={cn(
        "mt-4 h-full w-full ",
        isMainPage() ? "md:container" : "container"
      )}
    >
      {title && <h1 className="mb-2 text-left text-3xl font-bold">{title}</h1>}

      <>{children}</>
    </div>
  )
}

export default CommonPageLayout
