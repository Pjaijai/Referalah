import React from "react"
import Link from "next/link"
import PostCardInfoDisplay from "@/modules/post/components/info-display/card-info"
import PostHeader from "@/modules/post/components/info-display/header"

import { PostStatusType } from "@/types/common/post-status"
import { siteConfig } from "@/config/site"
import useViewport from "@/hooks/common/useViewport"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import CompanyNameDisplay from "@/components/customized-ui/info-display/company"
import CreatedAtDisplay from "@/components/customized-ui/info-display/created-at"
import { Icons } from "@/components/icons"

interface IReferralPostCardProps {
  uuid: string | null
  photoUrl: string | null
  companyName: string | null
  jobTitle: string | null
  yearOfExperience: number | null
  country: string | null
  province: string | null
  city: string | null
  industry: string | null
  url: string | null
  createdAt: string | null
  status: PostStatusType
  isViewingOwnProfile: boolean
}

const PostHistoryCard: React.FunctionComponent<IReferralPostCardProps> = ({
  uuid,
  jobTitle,
  city,
  companyName,
  country,
  industry,
  province,
  url,
  yearOfExperience,
  createdAt,
  status,
  isViewingOwnProfile,
}) => {
  const { isMobile } = useViewport()

  return (
    <Card className="flex flex-col justify-between rounded shadow-md">
      <Link
        href={`${siteConfig.page.referrerPost.href}/${uuid}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-start justify-start">
          <CardHeader className="w-full">
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
                  status={status}
                />
              </div>

              {isViewingOwnProfile && (
                <Link
                  href={`${siteConfig.page.editPost.href}/${uuid}`} 
                  className={buttonVariants({
                    size: isMobile ? "icon" : "sm",
                  })}
                >
                  <Icons.pencil className="m-0 h-4 w-4 sm:mr-2" />
                  {!isMobile && "編輯"}
                </Link>
              )}
            </div>

            <div className="mb-5 flex flex-col justify-between sm:flex-row">
              {/* location, industry, year of exp */}
              <PostCardInfoDisplay
                city={city}
                province={province}
                country={country}
                industry={industry}
                yearOfExperience={yearOfExperience}
              />
              <CardDescription className="flex-end mt-5 flex items-end justify-end sm:mt-0">
                <CreatedAtDisplay applyTo="card" createdAt={createdAt} />
              </CardDescription>
            </div>
          </CardHeader>
        </div>
      </Link>
    </Card>
  )
}

export default PostHistoryCard
