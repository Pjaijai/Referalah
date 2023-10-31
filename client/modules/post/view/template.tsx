"use client"

import React from "react"
import PostDetailsInfoDisplay from "@/modules/post/components/info-display/details-info"
import PostHeader from "@/modules/post/components/info-display/header"
import PostStatusDisplay from "@/modules/post/components/info-display/status"

import { MessageType } from "@/types/common/message-type"
import useGetPost from "@/hooks/api/post/get-post"
import ProfileCard from "@/components/customized-ui/cards/profile"
import CompanyNameDisplay from "@/components/customized-ui/info-display/company"
import CreatedAtDisplay from "@/components/customized-ui/info-display/created-at"
import PageStatusLayout from "@/components/layouts/page-status"

interface ReferralPostDetailsPageProps {
  postUuid: string | null
}
const ReferralPostDetailsPageTemplate: React.FunctionComponent<
  ReferralPostDetailsPageProps
> = ({ postUuid }) => {
  const { data: post, isLoading, isSuccess } = useGetPost(postUuid)

  return (
    <PageStatusLayout
      error={"搵唔到街招資料，請稍後再試。"}
      isLoading={isLoading}
      isSuccess={isSuccess}
    >
      {post && (
        <div className="mt-5 flex h-full w-full flex-col md:mt-0">
          <div className="my-0 mb-5 flex flex-col justify-between gap-4 md:my-5 md:flex-row">
            <div className="flex w-full flex-col">
              <div className="mb-3 flex w-full basis-full flex-row items-center justify-between">
                <PostStatusDisplay
                  postStatus={post.status}
                  className="flex-end"
                />
                <CreatedAtDisplay
                  createdAt={post.created_at && post.created_at.toString()}
                  className="justify-end text-xs text-muted-foreground"
                />
              </div>
              <div className="mr-2 flex w-full flex-col-reverse justify-between md:flex-row">
                <div className="flex items-center gap-1">
                  <div className="flex flex-col gap-2 ">
                    <PostHeader
                      title={post.job_title}
                      url={post.url}
                      subtitle={
                        post.company_name && (
                          <CompanyNameDisplay name={post.company_name} />
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <PostDetailsInfoDisplay
                city={post.city && post.city.cantonese_name}
                province={post.province && post.province.cantonese_name}
                country={post.country && post.country.cantonese_name}
                industry={post.industry && post.industry.cantonese_name}
                yearOfExperience={post.year_of_experience}
              />
            </div>

            <ProfileCard
              uuid={post.created_by}
              username={post.user && post.user.username}
              photoUrl={post.user && post.user.avatar_url}
              messageType={MessageType.POST}
              toUuid={post.created_by}
              postUuid={post.uuid}
              className="basis-1/3"
            />
          </div>
          <div className="whitespace-pre-wrap break-all">
            {post.description}
          </div>
        </div>
      )}
    </PageStatusLayout>
  )
}

export default ReferralPostDetailsPageTemplate
