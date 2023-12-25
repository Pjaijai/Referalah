import React from "react"
import Link from "next/link"

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
            <span>個人連結</span>
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
