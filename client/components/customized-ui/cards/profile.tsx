import React from "react"
import { useRouter } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import BaseAvatar from "@/components/customized-ui/avatars/base"

interface IProfileCardProps {
  uuid: string | null
  username: string | null
  photoUrl: string | null
  className?: string
}
const ProfileCard: React.FunctionComponent<IProfileCardProps> = ({
  photoUrl,
  username,
  uuid,
  className,
}) => {
  const router = useRouter()

  const handleProfileClick = () => {
    router.push(`${siteConfig.page.profile.href}/${uuid}`)
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        className={cn(
          "flex h-fit flex-col justify-center rounded border-2 px-3 py-4",
          className
        )}
      >
        <span className="mb-2 text-xs text-muted-foreground">推薦人</span>
        <div className="flex items-center justify-between gap-0 md:flex-col md:items-start md:gap-2">
          <div className="flex items-center">
            <BaseAvatar
              fallBack={username ? username[0] : "?"}
              alt={username}
              url={photoUrl || undefined}
              className="mr-2"
            />
            <div className="flex flex-col gap-1">
              <span className="whitespace-pre-wrap  break-all text-sm">
                @{username}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="md:w-full"
            onClick={handleProfileClick}
            size="xs"
          >
            查看用戶檔案
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
