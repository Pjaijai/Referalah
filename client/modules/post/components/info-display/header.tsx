import React, { PropsWithChildren, ReactNode } from "react"
import PostStatusDisplay from "@/modules/post/components/info-display/status"
import { useI18n } from "@/utils/services/internationalization/client"

import { TPostStatusType } from "@/types/common/post-status"
import { Badge } from "@/components/ui/badge"
import { CardTitle } from "@/components/ui/card"
import TooltipWrapper from "@/components/customized-ui/tool/tooltip-wrapper"
import { Icons } from "@/components/icons"

interface IPostHeaderProps {
  title: ReactNode | string
  subtitle: ReactNode | string
  url: string | null
  className?: string
  status?: TPostStatusType
  typeTitle?: string | null
}
const PostHeader: React.FunctionComponent<
  PropsWithChildren<IPostHeaderProps>
> = ({ title, subtitle, url, className, status, typeTitle }) => {
  const t = useI18n()
  const handleUrlClick = (e: any) => {
    e.preventDefault()
    if (url) window.open(url, "_blank")
  }

  return (
    <div className={className}>
      <CardTitle className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          {status && <PostStatusDisplay postStatus={status} />}
          {typeTitle && (
            <Badge className="flex justify-center">{typeTitle}</Badge>
          )}
        </div>

        <div className="inline-block">
          {title}
          {url && (
            <TooltipWrapper
              tooltipTrigger={
                <div onClick={handleUrlClick}>
                  <Icons.link className="h-4 w-4 align-middle" />
                </div>
              }
              tooltipContent={<span>{t("general.related_link_text")}</span>}
              tooltipTriggerProps={{ className: "ml-2" }}
            />
          )}
        </div>
      </CardTitle>
      <div className="mt-1 flex items-center justify-start text-sm text-muted-foreground">
        {subtitle}
      </div>
    </div>
  )
}

export default PostHeader
