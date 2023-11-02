import React, { useMemo } from "react"
import Link from "next/link"
import PostHeader from "@/modules/post/components/info-display/header"
import { formatCreatedAt } from "@/utils/common/helpers/format/date"

import { siteConfig } from "@/config/site"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import CompanyNameDisplay from "@/components/customized-ui/info-display/company"
import IndustryDisplay from "@/components/customized-ui/info-display/industry"
import LocationDisplay from "@/components/customized-ui/info-display/location"
import YearsOfExperienceDisplay from "@/components/customized-ui/info-display/years-of-experience"
import CollapsibleTextWrapper from "@/components/customized-ui/tool/collapsible-text-wrapper"

interface IReferralPostCardProps
   {
  uuid: string | null
  username: string | null
  photoUrl: string | null
  description: string | null
  companyName: string | null
  jobTitle: string | null
  yearOfExperience: number | null
  country: string | null
  province: string | null
  city: string | null
  industry: string | null
  url: string | null
  createdAt?: string | null
  createdBy: string | null
}

const ReferralPostCard: React.FunctionComponent<IReferralPostCardProps> = ({
  uuid,
  jobTitle,
  city,
  companyName,
  country,
  description,
  industry,
  photoUrl,
  province,
  url,
  username,
  yearOfExperience,
  createdAt,
  createdBy,
}) => {
  const formattedCreatedAt = useMemo(
    () => formatCreatedAt(createdAt),
    [createdAt]
  )

  return (
      <Card className="flex flex-col justify-between rounded shadow-md">
        <Link
          href={`${siteConfig.page.referrerPost.href}/${uuid}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-start justify-start">
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

                <Link href={`${siteConfig.page.profile.href}/${createdBy}`}>
                  <BaseAvatar
                    fallBack={username ? username[0] : "?"}
                    alt={username}
                    url={photoUrl || undefined}
                  />
                </Link>
              </div>

              {/* location, industry, year of exp */}
              <CardDescription className="text-overflow-ellipsis mb-5 mt-2 flex flex-wrap items-center justify-start gap-4">
                {(city || province || country) && (
                  <LocationDisplay
                    city={city}
                    province={province}
                    country={country}
                    className="xs:max-w-full max-w-sm"
                  />
                )}
                {industry && (
                  <IndustryDisplay
                    industry={industry}
                    className="xs:max-w-full max-w-xs"
                  />
                )}
                {yearOfExperience !== null && (
                  <YearsOfExperienceDisplay
                    yearOfExperience={yearOfExperience}
                    className="xs:max-w-full max-w-xs"
                  />
                )}
              </CardDescription>

              <Separator />
            </CardHeader>

            {/* desc */}
            <CardContent>
              {description && (
                <CollapsibleTextWrapper
                  text={description}
                  className="mt-2 whitespace-pre-wrap break-all text-sm "
                  expandButtonProps={{ className: "mt-2" }}
                />
              )}
            </CardContent>
          </div>
          {/* created at */}
          <CardFooter className="justify-end">
            <CardDescription>{formattedCreatedAt}</CardDescription>
          </CardFooter>
        </Link>
      </Card>
  )
}

export default ReferralPostCard
