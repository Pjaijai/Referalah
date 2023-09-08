import React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
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
  // const router
  // const handleClick =()=>{

  // }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link href={url} target="_blank">
            <Icons.link />
          </Link>

          {/* <Button variant="outline" onClick={handleClick}>
           
          </Button> */}
        </TooltipTrigger>
        <TooltipContent>
          <p>{url}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default LinkTooltip
