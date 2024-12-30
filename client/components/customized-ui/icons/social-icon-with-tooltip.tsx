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
        return (
          <Icons.linkedinFilled
            width={22}
            height={22}
            className="fill-indigo-600"
          />
        )
      case ESocialLink.INSTAGRAM:
        return <Icons.instagram />
      case ESocialLink.THREADS:
        return <Icons.threads width={18} height={18} />
      case ESocialLink.GITHUB:
        return (
          <Icons.githubFilled
            width={22}
            height={22}
            className="fill-indigo-600"
          />
        )
      case ESocialLink.GITLAB:
        return <Icons.gitlab />
      case ESocialLink.TWITCH:
        return <Icons.twitch />
      case ESocialLink.YOUTUBE:
        return <Icons.youtube />
      case ESocialLink.TELEGRAM:
        return (
          <Icons.telegram width={22} height={22} className="fill-indigo-600" />
        )
      case ESocialLink.CUSTOM:
        return <Icons.link />
      default:
        return <Icons.pencil />
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
