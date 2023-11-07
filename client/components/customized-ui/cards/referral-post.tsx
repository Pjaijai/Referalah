import React from "react"
import Link from "next/link"
import PostCardInfoDisplay from "@/modules/post/components/info-display/card-info"
import PostHeader from "@/modules/post/components/info-display/header"

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
import CreatedAtDisplay from "@/components/customized-ui/info-display/created-at"
import CollapsibleTextWrapper from "@/components/customized-ui/tool/collapsible-text-wrapper"

interface IReferralPostCardProps {
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
  createdAt: string | null
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
  return (
    <Card className="flex h-full flex-col justify-between rounded shadow-md ">
      <Link
        href={`${siteConfig.page.referrerPost.href}/${uuid}`}
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

              <Link href={`${siteConfig.page.profile.href}/${createdBy}`}>
                <BaseAvatar
                  fallBack={username ? username[0] : "?"}
                  alt={username}
                  url={photoUrl || undefined}
                />
              </Link>
            </div>

            {/* location, industry, year of exp */}
            <PostCardInfoDisplay
              city={city}
              province={province}
              country={country}
              industry={industry}
              yearOfExperience={yearOfExperience}
            />
            <Separator />
          </CardHeader>

          {/* desc */}
          <CardContent>
            {description && (
              <CollapsibleTextWrapper
                text={description}
                className="mt-2 whitespace-pre-wrap break-all text-sm"
                expandButtonProps={{ className: "mt-2" }}
              />
            )}
          </CardContent>
        </div>

        {/* created at */}
        <CardFooter className="mt-auto w-full justify-end">
          <CardDescription>
            <CreatedAtDisplay applyTo="card" createdAt={createdAt} />
          </CardDescription>
        </CardFooter>
      </Link>
    </Card>
  )
}

export default ReferralPostCard
