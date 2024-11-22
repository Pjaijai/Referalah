import React from "react"

import { ESocialLink } from "@/types/common/social-links"
import { Icons } from "@/components/icons"

type SocialLinkOption = {
  value: ESocialLink
  label: React.ReactNode
}

const getIconForSocialLink = (
  link: ESocialLink,
  size: number = 16
): React.ReactNode => {
  switch (link) {
    case ESocialLink.LINKEDIN:
      return <Icons.linkedin size={size} />
    case ESocialLink.INSTAGRAM:
      return <Icons.instagram size={size} />
    case ESocialLink.THREADS:
      return <Icons.threads size={size} />
    case ESocialLink.GITHUB:
      return <Icons.github size={size} />
    case ESocialLink.GITLAB:
      return <Icons.gitlab size={size} />
    case ESocialLink.TWITCH:
      return <Icons.twitch size={size} />
    case ESocialLink.YOUTUBE:
      return <Icons.youtube size={size} />
    case ESocialLink.CUSTOM:
      return <Icons.pencil size={size} />
  }
}

const getDisplayNameForSocialLink = (link: ESocialLink): string => {
  switch (link) {
    case ESocialLink.LINKEDIN:
      return "LinkedIn"
    case ESocialLink.INSTAGRAM:
      return "Instagram"
    case ESocialLink.THREADS:
      return "Threads"
    case ESocialLink.GITHUB:
      return "GitHub"
    case ESocialLink.GITLAB:
      return "GitLab"
    case ESocialLink.TWITCH:
      return "Twitch"
    case ESocialLink.YOUTUBE:
      return "YouTube"
    case ESocialLink.CUSTOM:
      return "Custom"
  }
}

export const useGetSocialLinkOptions = (): SocialLinkOption[] => {
  return React.useMemo(
    () =>
      Object.values(ESocialLink).map((link) => ({
        value: link,
        label: (
          <div className="flex w-full flex-row items-center justify-center gap-2 font-medium text-slate-500">
            {getIconForSocialLink(link)}
            <span>{getDisplayNameForSocialLink(link)}</span>
          </div>
        ),
      })),
    []
  )
}
