import React from "react"
import { useI18n } from "@/utils/services/internationalization/client"

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
      return <Icons.linkedinFilled width={16} height={16} />
    case ESocialLink.INSTAGRAM:
      return <Icons.instagram size={size} />
    case ESocialLink.THREADS:
      return <Icons.threads width={18} height={18} />
    case ESocialLink.GITHUB:
      return <Icons.githubFilled width={18} height={18} />
    case ESocialLink.GITLAB:
      return <Icons.gitlab size={size} />
    case ESocialLink.TWITCH:
      return <Icons.twitch size={size} />
    case ESocialLink.YOUTUBE:
      return <Icons.youtube size={size} />
    case ESocialLink.TELEGRAM:
      return <Icons.telegram width={18} height={18} />
    case ESocialLink.CUSTOM:
      return <Icons.pencil size={size} />
    default:
      return <Icons.pencil size={size} />
  }
}

export const useGetSocialLinkOptions = (): SocialLinkOption[] => {
  const t = useI18n()

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
      case ESocialLink.TELEGRAM:
        return "Telegram"
      case ESocialLink.CUSTOM:
        return t("general.custom")
    }
  }

  return React.useMemo(
    () =>
      Object.values(ESocialLink).map((link) => ({
        value: link,
        label: (
          <div className="flex w-full flex-row items-center justify-center gap-2 font-medium text-slate-500">
            <span>{getIconForSocialLink(link)}</span>
            <span>{getDisplayNameForSocialLink(link)}</span>
          </div>
        ),
      })),
    []
  )
}
