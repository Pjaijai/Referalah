import React from "react"
import { useCurrentLocale } from "@/utils/services/internationalization/client"
import Autoplay from "embla-carousel-autoplay"

import { ISearchPostResponse } from "@/types/api/response/referer-post"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import ReferralPostCard from "@/components/customized-ui/cards/referral-post"

interface IPostCarouselProps {
  list: ISearchPostResponse[]
}
const PostCarousel: React.FunctionComponent<IPostCarouselProps> = ({
  list,
}) => {
  const locale = useCurrentLocale()
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent>
        {list.map((data) => {
          return (
            <CarouselItem className="basis-1/5 md:basis-1/4 ">
              <ReferralPostCard
                jobTitle={data.job_title}
                username={data.user && data.user.username}
                photoUrl={data.user && data.user.avatar_url}
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
                companyName={data.company_name}
                url={data.url}
                yearOfExperience={data.year_of_experience}
                uuid={data.uuid}
                createdBy={data.created_by && data.created_by}
                key={data.uuid}
                createdAt={data.created_at && data.created_at.toString()}
              />
            </CarouselItem>
          )
        })}
      </CarouselContent>
    </Carousel>
  )
}

export default PostCarousel
