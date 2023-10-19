import React, { PropsWithChildren, ReactNode } from "react"

import { CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

import TooltipWrapper from "../tool/tooltip-wrapper"

interface IPostHeaderProps {
  title: ReactNode | string
  subtitle: ReactNode | string
  url: string | null
}
const PostHeader: React.FunctionComponent<
  PropsWithChildren<IPostHeaderProps>
> = ({ title, subtitle, url }) => {
  const handleUrlClick = () => {
    if (url) window.open(url, "_blank")
  }

  return (
    <div>
      <CardTitle className="inline-block">
        {title}
        {url && (
          <TooltipWrapper
            tooltipTrigger={
              <a onClick={handleUrlClick} className="align-middle">
                <Icons.link className="ml-2 h-4 w-4" />
              </a>
            }
            tooltipContent={<span>相關連結</span>}
          />
        )}
      </CardTitle>
      <div className="flex items-center justify-start text-sm text-muted-foreground">
        {subtitle}
      </div>
    </div>
  )
}

export default PostHeader
