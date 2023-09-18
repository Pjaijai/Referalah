import React from "react"
import Link from "next/link"

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
          <Link href={url} target="_blank">
            <Icons.link />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{url}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default LinkTooltip
