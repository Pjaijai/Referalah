"use client"

import React, { PropsWithChildren } from "react"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface CommonPageLayout {
  title?: string
  titlePosition?: "left" | "middle" | "right"
  className?: string
}

const CommonPageLayout: React.FunctionComponent<
  PropsWithChildren<CommonPageLayout>
> = ({ title, children, titlePosition = "left", className }) => {
  const pathname = usePathname()
  const router = useRouter()

  const isMainPage = () => {
    const localePrefixes = ["/zh-hk", "/en-ca"]
    const pathWithoutLocale = localePrefixes.reduce(
      (path, prefix) => path.replace(prefix, ""),
      pathname
    )
    return pathWithoutLocale === "/" || pathWithoutLocale === ""
  }

  const handleBackToPostClick = () => {
    router.back()
  }

  return (
    <div
      className={cn(
        "mt-4 h-full w-full",
        isMainPage() ? "md:container" : "container",
        className
      )}
    >
      <div className="flex items-center">
        <Button
          onClick={handleBackToPostClick}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "bg-transparent p-0 md:hidden",
            isMainPage() && "hidden"
          )}
        >
          <Icons.chevronLeft className="h-6 w-6" />
        </Button>

        {/* Title Container */}
        <div
          className={cn(
            "grow",
            titlePosition === "left"
              ? "ml-2 text-left md:ml-0"
              : titlePosition === "middle"
              ? "text-center"
              : "text-right"
          )}
        >
          {title && <h1 className="mb-2 text-3xl font-bold">{title}</h1>}
        </div>
      </div>

      {children}
    </div>
  )
}
export default CommonPageLayout
