import React from "react"
import Link from "next/link"
import { Icons } from "@/components/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
