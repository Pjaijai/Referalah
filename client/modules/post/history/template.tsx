"use client"

import React from "react"
import PostHistoryCard from "@/modules/post/history/components/cards/post-history"

import useGetPostListByUserUuid from "@/hooks/api/post/get-post-list-by-user-uuid"
import useUserStore from "@/hooks/state/user/store"
import CardSkeletonList from "@/components/customized-ui/skeletons/card-list"

interface IPostHistoryTemplateProps {
  slug: string
}
const PostHistoryTemplate: React.FunctionComponent<
  IPostHistoryTemplateProps
> = ({ slug }) => {
  const { data, isLoading } = useGetPostListByUserUuid(slug)
  const userUuid = useUserStore((state) => state.uuid)
  const isViewingOwnProfile = slug === userUuid

  return (
    <>
      {isLoading && (
        <CardSkeletonList className="xs:grid-cols-1 lg:grid-cols-2" />
      )}

      {!isLoading && data && !(data.length > 0) && (
        <div className="mt-8 rounded-lg border-2 p-4 text-center">冇資料🥲</div>
      )}

      {!isLoading && data && (
        <div className="mt-8 grid w-full grid-cols-1 gap-4 overflow-hidden lg:grid-cols-2">
          {data.map((data) => (
            <PostHistoryCard
              city={data.city && data.city.cantonese_name}
              companyName={data.company_name}
              country={data.country && data.country.cantonese_name}
              status={data.status}
              industry={data.industry && data.industry.cantonese_name}
              jobTitle={data.job_title}
              photoUrl={data.user && data.user.avatar_url}
              province={data.province && data.province.cantonese_name}
              yearOfExperience={data.year_of_experience}
              key={data.uuid}
              createdAt={data.created_at}
              uuid={data.uuid}
              url={data.url}
              isViewingOwnProfile={isViewingOwnProfile}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default PostHistoryTemplate
