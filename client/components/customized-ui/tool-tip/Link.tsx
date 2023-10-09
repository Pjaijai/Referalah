import React from "react"
import Link from "next/link"
import { Icons } from "@/components/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ILinkTooltipProps {
  url: string
}
const LinkTooltip: React.FunctionComponent<ILinkTooltipProps> = ({ url }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link href={url} target="_blank" className={cn(buttonVariants({ variant:'ghost', className:'gap-2' }))}>
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
