import React, { useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PostStatusDisplay from "@/modules/post/components/info-display/status"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import { TLocationData } from "@/types/api/response/location"
import { TPostStatusType } from "@/types/common/post-status"
import { EPostType } from "@/types/common/post-type"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useLocationOptionsList from "@/hooks/common/options/location-options-list"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import PostTypeBadge from "@/components/customized-ui/badges/post-type"
import ContactRequestCountIcon from "@/components/customized-ui/icons/contact-request-count"
import LinkIcon from "@/components/customized-ui/icons/link"
import CreatedAtDisplay from "@/components/customized-ui/info-display/created-at"
import IndustryDisplay from "@/components/customized-ui/info-display/industry"
import YearsOfExperienceDisplay from "@/components/customized-ui/info-display/years-of-experience"
import { Icons } from "@/components/icons"

interface IPostCardProps {
  uuid: string | null
  username: string | null
  photoUrl: string | null
  companyName: string | null
  jobTitle: string | null
  yearOfExperience?: number | null
  locationUuid: string | null
  locationList: TLocationData[]
  industry?: string | null
  url: string | null
  createdAt: string | null
  createdBy: string | null
  className?: string
  type: EPostType
  requestCount: number
  status?: TPostStatusType
}

const PostCard: React.FunctionComponent<IPostCardProps> = ({
  type,
  uuid,
  jobTitle,
  locationUuid,
  locationList,
  companyName,
  photoUrl,
  url,
  industry,
  username,
  yearOfExperience,
  createdAt,
  createdBy,
  className,
  requestCount,
  status,
}) => {
  const router = useRouter()
  const locale = useCurrentLocale()

  // Use the hook to get location options with proper labels
  const locationOptions = useLocationOptionsList(
    locationList,
    false, // showAllOption
    locale
  )

  // Find the location label based on the locationUuid
  const location = useMemo(() => {
    if (!locationUuid) return null
    const locationOption = locationOptions.find(
      (option) => option.value === locationUuid
    )
    return locationOption?.label ? String(locationOption.label) : null
  }, [locationUuid, locationOptions])

  const handleAvatarOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    router.push(`${siteConfig.page.profile.href}/${createdBy}`)
  }

  return (
    <Card
      className={cn(
        "flex  max-w-sm shrink-0 flex-col rounded-[8px] border-none shadow-xl",
        className
      )}
    >
      <Link
        href={`${siteConfig.page.viewPost.href}/${uuid}`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex h-36 w-full flex-col items-start justify-start pb-0">
          <div className=" flex h-full w-full flex-col items-start justify-between rounded-lg bg-slate-50 p-2">
            <h2 className="line-clamp-2 w-full text-xl font-semibold">
              {jobTitle}
            </h2>
            <p className="w-full truncate text-sm font-medium">{companyName}</p>
          </div>
        </CardHeader>

        <CardContent className="mt-[10px] flex w-full flex-col">
          <div className="flex w-full justify-between">
            <div className="flex flex-row gap-2">
              {status && <PostStatusDisplay postStatus={status} />}
              <PostTypeBadge type={type} />
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <ContactRequestCountIcon
                count={requestCount}
                className={cn("h-5 w-5 align-middle")}
                status={requestCount > 0 ? "active" : "inactive"}
              />

              <LinkIcon
                openInNewTab
                status={url ? "active" : "inactive"}
                className={cn("h-5 w-5 ")}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-row items-end">
            {/* location, industry, year of exp */}
            <div className="flex w-full flex-col items-start justify-start gap-2 text-sm font-normal text-slate-700">
              {location && (
                <div className="flex items-center justify-start gap-2">
                  <div>
                    <Icons.location width="18" height="18" />
                  </div>
                  <span className="ml-1">{location}</span>
                </div>
              )}

              {industry && <IndustryDisplay industry={industry} />}
              {typeof yearOfExperience === "number" && (
                <YearsOfExperienceDisplay
                  yearOfExperience={yearOfExperience}
                  className="gap-2"
                />
              )}
            </div>
          </div>
          <Separator className="mt-6" />
        </CardContent>

        {/* created at */}
        <CardFooter className="flex w-full flex-row  items-center justify-between">
          <div className="flex w-full flex-row justify-between">
            <div className="flex flex-row items-center justify-center gap-4">
              <div onClick={handleAvatarOnClick}>
                <BaseAvatar
                  fallBack={username ? username[0] : "?"}
                  alt={username}
                  url={photoUrl || undefined}
                />
              </div>

              <p>{username}</p>
            </div>
            <CreatedAtDisplay applyTo="card" createdAt={createdAt} />
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}

export default PostCard
