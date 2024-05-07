import React from "react"
import Link from "next/link"
import { useScopedI18n } from "@/utils/services/internationalization/client"
import Autoplay from "embla-carousel-autoplay"

import { TContactRequestListResponse } from "@/types/api/response/contact-request/contact-request-list"
import { siteConfig } from "@/config/site"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

interface IContactRequestCarouselProps {
  list: TContactRequestListResponse[]
}
const ContactRequestCarousel: React.FunctionComponent<
  IContactRequestCarouselProps
> = ({ list }) => {
  const scopedT = useScopedI18n("index")

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent>
        {list.map((data) => {
          if (data.type === "post")
            return (
              <CarouselItem className="basis-1/2 md:basis-1/4">
                <div className="flex shrink-0 flex-col justify-center    ">
                  <p className="shrink-0">@{data.senderUserName}</p>
                  <p className="shrink-0">{scopedT("requested")}</p>
                  <Link
                    href={`${siteConfig.page.profile.href}/${data.postUuid}`}
                  >
                    <p
                      className="shrink-0  text-green-700
 dark:text-yellow-300"
                    >
                      {data.postJobTitle}
                    </p>
                  </Link>
                </div>
              </CarouselItem>
            )
          if (data.type === "member")
            return (
              <CarouselItem className="basis-1/2 md:basis-1/4">
                <div className="flex w-fit  shrink-0 flex-col justify-center  ">
                  <p>@{data.senderUserName} </p>
                  <p>{scopedT("contacted")}</p>
                  <Link
                    href={`${siteConfig.page.profile.href}/${data.receiverUuid}`}
                  >
                    <p
                      className=" text-green-700
 dark:text-yellow-300"
                    >
                      @{data.receiverUserName}
                    </p>
                  </Link>
                </div>
              </CarouselItem>
            )
        })}
      </CarouselContent>
    </Carousel>
  )
}

export default ContactRequestCarousel
