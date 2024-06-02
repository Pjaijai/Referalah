import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PostCardInfoDisplay from "@/modules/post/components/info-display/card-info"
import PostHeader from "@/modules/post/components/info-display/header"
import usePostTypeTitle from "@/modules/post/hooks/post-type-title"

import { EPostType } from "@/types/common/post-type"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import ContactRequestCount from "@/components/customized-ui/icons/contact-request-count"
import CompanyNameDisplay from "@/components/customized-ui/info-display/company"
import CreatedAtDisplay from "@/components/customized-ui/info-display/created-at"

interface IReferralPostCardProps {
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
}

// NOTE: please use onClick with e.preventDefault() for any links inside this component to prevent validateDOMNesting warning

const ReferralPostCard: React.FunctionComponent<IReferralPostCardProps> = ({
  type,
  uuid,
  jobTitle,
  city,
  companyName,
  country,
  industry,
  photoUrl,
  province,
  url,
  username,
  yearOfExperience,
  createdAt,
  createdBy,
  className,
  requestCount,
}) => {
  const router = useRouter()

  const handleAvatarOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    router.push(`${siteConfig.page.profile.href}/${createdBy}`)
  }

  const postTypeTitle = usePostTypeTitle(type)

  return (
    <Card
      className={cn(
        "flex h-fit shrink-0 flex-col justify-between rounded shadow-md ",
        className
      )}
    >
      <Link
        href={`${siteConfig.page.viewPost.href}/${uuid}`}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full flex-col items-start justify-start"
      >
        <div className="flex w-full flex-col items-start justify-start">
          <CardHeader className="w-full pb-2">
            {/* title, subtitle, url, avatar, quick action */}
            <div className="flex flex-row items-start justify-between gap-3 sm:gap-1">
              <div className="mb-2 flex basis-full items-center gap-3 sm:basis-2/3 md:basis-3/5">
                <PostHeader
                  title={jobTitle}
                  subtitle={
                    companyName ? (
                      <CompanyNameDisplay name={companyName} />
                    ) : undefined
                  }
                  url={url}
                />
              </div>

              <div onClick={handleAvatarOnClick}>
                <BaseAvatar
                  fallBack={username ? username[0] : "?"}
                  alt={username}
                  url={photoUrl || undefined}
                />
              </div>
            </div>

            <div className="flex w-full flex-col items-start justify-start gap-1 md:flex-row md:items-end md:justify-between">
              {/* location, industry, year of exp */}
              <PostCardInfoDisplay
                city={city}
                province={province}
                country={country}
                industry={industry}
                yearOfExperience={yearOfExperience}
                requestCount={requestCount}
              />
            </div>
            <Separator />
          </CardHeader>
        </div>

        {/* created at */}
        <CardFooter className="mt-2 flex w-full flex-row justify-between">
          {postTypeTitle && (
            <Badge className="flex justify-center">{postTypeTitle}</Badge>
          )}
          <CreatedAtDisplay applyTo="card" createdAt={createdAt} />
        </CardFooter>
      </Link>
    </Card>
  )
}

export default ReferralPostCard
