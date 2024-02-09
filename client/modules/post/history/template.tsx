"use client"

import React from "react"
import PostHistoryCard from "@/modules/post/history/components/cards/post-history"
import {
  useCurrentLocale,
  useI18n,
} from "@/utils/services/internationalization/client"

import useGetPostListByUserUuid from "@/hooks/api/post/get-post-list-by-user-uuid"
import useUserStore from "@/hooks/state/user/store"
import CardSkeletonList from "@/components/customized-ui/skeletons/card-list"

interface IPostHistoryTemplateProps {
  slug: string
}
const PostHistoryTemplate: React.FunctionComponent<
  IPostHistoryTemplateProps
> = ({ slug }) => {
  const t = useI18n()
  const locale = useCurrentLocale()
  const { data, isLoading } = useGetPostListByUserUuid(slug)
  const userUuid = useUserStore((state) => state.uuid)
  const isViewingOwnProfile = slug === userUuid

  return (
    <>
      {isLoading && (
        <CardSkeletonList className="xs:grid-cols-1 lg:grid-cols-2" />
      )}

      {!isLoading && data && !(data.length > 0) && (
        <div className="mt-8 rounded-lg border-2 p-4 text-center">
          {t("history.no_data")}
        </div>
      )}

      {!isLoading && data && (
        <div className="mt-8 grid w-full grid-cols-1 gap-4 overflow-hidden lg:grid-cols-2">
          {data.map((data) => (
            <PostHistoryCard
              companyName={data.company_name}
              status={data.status}
              jobTitle={data.job_title}
              photoUrl={data.user && data.user.avatar_url}
              yearOfExperience={data.year_of_experience}
              key={data.uuid}
              createdAt={data.created_at}
              uuid={data.uuid}
              url={data.url}
              isViewingOwnProfile={isViewingOwnProfile}
              province={
                locale === "zh-hk"
                  ? data.province && data.province.cantonese_name
                  : data.province && data.province.english_name
              }
              country={
                locale === "zh-hk"
                  ? data.country && data.country.cantonese_name
                  : data.country && data.country.english_name
              }
              city={
                locale === "zh-hk"
                  ? data.city && data.city.cantonese_name
                  : data.city && data.city.english_name
              }
              industry={
                locale === "zh-hk"
                  ? data.industry && data.industry.cantonese_name
                  : data.industry && data.industry.english_name
              }
            />
          ))}
        </div>
      )}
    </>
  )
}

export default PostHistoryTemplate
