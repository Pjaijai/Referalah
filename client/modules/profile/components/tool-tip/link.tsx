import React from "react"
import Link from "next/link"
import { useI18n } from "@/utils/services/internationalization/client"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

interface ILinkTooltipProps {
  url: string
}
const LinkTooltip: React.FunctionComponent<ILinkTooltipProps> = ({ url }) => {
  const t = useI18n()
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link
            href={url}
            target="_blank"
            className={cn(
              buttonVariants({ variant: "ghost", className: "gap-2" })
            )}
          >
            <Icons.link />
            <span>{t("general.link")}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{url} </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default LinkTooltip
