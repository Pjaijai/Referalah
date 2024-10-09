import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PostStatusDisplay from "@/modules/post/components/info-display/status"

import { TPostStatusType } from "@/types/common/post-status"
import { EPostType } from "@/types/common/post-type"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import PostTypeBadge from "@/components/customized-ui/badges/post-type"
import ContactRequestCountIcon from "@/components/customized-ui/icons/contact-request-count"
import LinkIcon from "@/components/customized-ui/icons/link"
import CreatedAtDisplay from "@/components/customized-ui/info-display/created-at"
import IndustryDisplay from "@/components/customized-ui/info-display/industry"
import LocationDisplay from "@/components/customized-ui/info-display/location"
import YearsOfExperienceDisplay from "@/components/customized-ui/info-display/years-of-experience"

interface IPostCardProps {
  uuid: string | null
  username: string | null
  photoUrl: string | null
  companyName: string | null
  jobTitle: string | null
  yearOfExperience?: number | null
  country: string | null
  province: string | null
  city: string | null
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
  city,
  companyName,
  country,
  photoUrl,
  province,
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

  const handleAvatarOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    router.push(`${siteConfig.page.profile.href}/${createdBy}`)
  }

  return (
    <Card
      className={cn(
        "flex  max-w-sm shrink-0 flex-col justify-between rounded border-none shadow-lg",
        className
      )}
    >
      <Link
        href={`${siteConfig.page.viewPost.href}/${uuid}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-h-fit w-full shrink-0 flex-col items-start justify-start">
          <CardHeader className="w-full">
            <div className="flex w-full flex-col items-start justify-between rounded-lg bg-slate-50 p-4">
              <h2 className="line-clamp-2 w-full text-xl font-semibold">
                {jobTitle}
              </h2>
              <p className="w-full truncate text-sm font-medium">
                {companyName}
              </p>
            </div>
          </CardHeader>
        </div>

        <CardContent className="flex w-full flex-col">
          <div className="mt-4 flex w-full justify-between">
            <div className="flex flex-row gap-2">
              {status && <PostStatusDisplay postStatus={status} />}
              <PostTypeBadge type={type} />
            </div>

            <div className="flex flex-row items-center justify-center gap-4">
              <ContactRequestCountIcon
                count={requestCount}
                className={cn("h-4 w-4 align-middle")}
                status={requestCount > 0 ? "active" : "inactive"}
              />

              <LinkIcon openInNewTab status={url ? "active" : "inactive"} />
            </div>
          </div>

          <div className="mt-8 flex flex-row items-end">
            {/* location, industry, year of exp */}
            <div className="flex w-full flex-col items-start justify-start gap-2 text-sm font-normal">
              {(city || province || country) && (
                <LocationDisplay
                  city={city}
                  province={province}
                  country={country}
                  className="gap-2"
                />
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
        <CardFooter className="mt-2 flex w-full flex-row  items-center justify-between">
          <div className="mt-2 flex w-full flex-row justify-between">
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
