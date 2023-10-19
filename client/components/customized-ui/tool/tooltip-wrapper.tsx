import React, { ReactNode } from "react"
import {
  TooltipContentProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipTriggerProps,
} from "@radix-ui/react-tooltip"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ITooltipWrapperProps {
  tooltipProviderProps?: TooltipProviderProps
  tooltipProps?: TooltipProps
  tooltipTriggerProps?: TooltipTriggerProps &
    React.RefAttributes<HTMLButtonElement>
  tooltipContentProps?: Omit<
    TooltipContentProps & React.RefAttributes<HTMLDivElement>,
    "ref"
  > &
    React.RefAttributes<HTMLDivElement>
  tooltipTrigger: ReactNode
  tooltipContent: ReactNode
}
const TooltipWrapper: React.FunctionComponent<ITooltipWrapperProps> = ({
  tooltipProviderProps,
  tooltipProps,
  tooltipTriggerProps,
  tooltipContentProps,
  tooltipTrigger,
  tooltipContent,
}) => {
  return (
    <TooltipProvider delayDuration={200} {...tooltipProviderProps}>
      <Tooltip {...tooltipProps}>
        <TooltipTrigger {...tooltipTriggerProps}>
          {tooltipTrigger}
        </TooltipTrigger>
        <TooltipContent {...tooltipContentProps}>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default TooltipWrapper
