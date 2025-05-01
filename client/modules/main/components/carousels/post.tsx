"use client"

import React from "react"
import { useCurrentLocale } from "@/utils/services/internationalization/client"

import { ISearchPostResponse } from "@/types/api/response/referer-post"
import { ELocale } from "@/types/common/enums/locale"
import PostCard from "@/components/customized-ui/cards/post"
import Marquee from "@/components/magicui/marquee"

interface IPostCarouselProps {
  list: ISearchPostResponse[]
}
const PostCarousel: React.FunctionComponent<IPostCarouselProps> = ({
  list,
}) => {
  const locale = useCurrentLocale()
  return (
    <div className="relative flex h-fit  flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:60s]">
        {list.map((data) => {
          return (
            <PostCard
              className="w-96"
              type={data.type}
              yearOfExperience={data.year_of_experience}
              jobTitle={data.job_title}
              username={data.user && data.user.username}
              photoUrl={data.user && data.user.avatar_url}
              industry={
                locale === ELocale.ZH_HK
                  ? data.industry && data.industry.cantonese_name
                  : data.industry && data.industry.english_name
              }
              province={
                locale === ELocale.ZH_HK
                  ? data.province && data.province.cantonese_name
                  : data.province && data.province.english_name
              }
              country={
                locale === ELocale.ZH_HK
                  ? data.country && data.country.cantonese_name
                  : data.country && data.country.english_name
              }
              city={
                locale === ELocale.ZH_HK
                  ? data.city && data.city.cantonese_name
                  : data.city && data.city.english_name
              }
              companyName={data.company_name}
              url={data.url}
              uuid={data.uuid}
              createdBy={data.created_by && data.created_by}
              key={data.uuid}
              createdAt={data.created_at && data.created_at.toString()}
              requestCount={data.contact_request_count}
            />
          )
        })}
      </Marquee>
      <div className="pointer-events-none inset-y-0 left-0 hidden w-2/12 bg-gradient-to-r  from-white dark:from-background md:absolute md:block md:w-1/5"></div>
      <div className="pointer-events-none inset-y-0 right-0 hidden w-2/12 bg-gradient-to-l from-white dark:from-background md:absolute md:block md:w-1/5"></div>
    </div>
  )
}

export default PostCarousel
