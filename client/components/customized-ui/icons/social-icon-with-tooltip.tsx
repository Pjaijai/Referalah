import React from "react"

import { ESocialLink, TSocialLink } from "@/types/common/social-links"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

interface SocialIconProps {
  type: TSocialLink
  name: string | null
  url: string
  className?: string
}

const SocialIconWithTooltip: React.FC<SocialIconProps> = ({
  type,
  name,
  url,
  className,
}) => {
  const getIcon = () => {
    switch (type) {
      case ESocialLink.LINKEDIN:
        return <Icons.linkedin />
      case ESocialLink.INSTAGRAM:
        return <Icons.instagram />
      case ESocialLink.THREADS:
        return <Icons.threads />
      case ESocialLink.GITHUB:
        return <Icons.github />
      case ESocialLink.GITLAB:
        return <Icons.gitlab />
      case ESocialLink.TWITCH:
        return <Icons.twitch />
      case ESocialLink.YOUTUBE:
        return <Icons.youtube />
      default:
        return <Icons.link />
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={`shrink-0 rounded-full bg-white p-3  text-indigo-600 ${className}`}
          >
            {getIcon()}
          </a>
        </TooltipTrigger>

        {name && (
          <TooltipContent>
            <p>{name}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

export default SocialIconWithTooltip
