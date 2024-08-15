import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import usePostTypeTitle from "@/modules/post/hooks/post-type-title"

import { EPostType } from "@/types/common/post-type"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import ContactRequestCount from "@/components/customized-ui/icons/contact-request-count"
import CreatedAtDisplay from "@/components/customized-ui/info-display/created-at"
import IndustryDisplay from "@/components/customized-ui/info-display/industry"
import LocationDisplay from "@/components/customized-ui/info-display/location"
import YearsOfExperienceDisplay from "@/components/customized-ui/info-display/years-of-experience"
import { Icons } from "@/components/icons"

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

const ReferralPostCard: React.FunctionComponent<IReferralPostCardProps> = ({
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
}) => {
  const router = useRouter()

  const handleAvatarOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    router.push(`${siteConfig.page.profile.href}/${createdBy}`)
  }

  const postTypeTitle = usePostTypeTitle(type)
  const handleUrlClick = (e: any) => {
    e.preventDefault()
    if (url) window.open(url, "_blank")
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
            <Badge className="w-fit rounded-xl bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
              {postTypeTitle}
            </Badge>
            <div className="flex flex-row items-center justify-center gap-4">
              <ContactRequestCount count={requestCount} />

              {url && (
                <div onClick={handleUrlClick}>
                  <Icons.link className="h-4 w-4 align-middle" />
                </div>
              )}
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

export default ReferralPostCard
