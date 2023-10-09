import React from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ILinkTooltipProps {
  trigger: React.ReactNode
  content: React.ReactNode
}
const BaseTooltip: React.FunctionComponent<ILinkTooltipProps> = ({
  trigger,
  content,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default BaseTooltip
