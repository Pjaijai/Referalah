"use client"

import React from "react"
import Link from "next/link"
import ContactRequestCarousel from "@/modules/main/components/carousels/contact-request"
import PostCarousel from "@/modules/main/components/carousels/post"
import UserCount from "@/modules/main/components/user-count"
import { useScopedI18n } from "@/utils/services/internationalization/client"
import { motion } from "framer-motion"

import { TContactRequestListResponse } from "@/types/api/response/contact-request/contact-request-list"
import { ISearchPostResponse } from "@/types/api/response/referer-post"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useUserStore from "@/hooks/state/user/store"
import { buttonVariants } from "@/components/ui/button"

const MainPageTemplate = ({
  count,
  posts,
  contactList,
}: {
  count: number | null
  posts: ISearchPostResponse[]
  contactList: TContactRequestListResponse[]
}) => {
  const isUserSignIn = useUserStore((state) => state.isSignIn)

  const scopedT = useScopedI18n("index")

  return (
    <div className="relative mt-20 flex w-full flex-row items-center justify-center md:mt-16 ">
      <div className="relative z-30 h-fit w-full overflow-hidden md:mx-auto md:max-w-7xl  md:p-4 ">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
        >
          <div className="flex flex-col items-center justify-center text-4xl font-black text-black dark:text-white md:flex-row">
            <h2 className="flex shrink-0 flex-row text-center">
              {scopedT("connect")}
            </h2>
            <h2 className="flex shrink-0 flex-row text-center  md:ml-3">
              {scopedT("hong_kong")}
            </h2>

            <h2 className=" text-indigo-600 md:ml-3">
              {scopedT("professionals")}
            </h2>
          </div>
          <div className="text-inter mt-6 flex flex-row justify-center  text-base text-foreground md:text-start md:text-lg">
            <div className="flex flex-col items-center justify-center text-slate-500">
              <p className="text-xl font-light italic ">
                &quot;{scopedT("subTitle")}&quot;
              </p>

              <p className="text-[14px]">Referalah</p>
            </div>
          </div>

          <div className="mt-16 flex w-full flex-row justify-center">
            {isUserSignIn ? (
              <Link
                href={siteConfig.page.searchPost.href}
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "lg",
                  }),
                  "rounded-md bg-indigo-600  p-4 text-xl font-bold hover:bg-indigo-600 md:p-4 "
                )}
              >
                {scopedT("check_latest_post")}
              </Link>
            ) : (
              <Link
                href={siteConfig.page.signUp.href}
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "lg",
                  }),
                  "rounded-md bg-indigo-600  p-4 text-xl font-bold hover:bg-indigo-600 md:p-4 "
                )}
              >
                {scopedT("join_now")}
              </Link>
            )}
          </div>

          <div className="flex flex-row justify-center">
            <UserCount numberOfMembers={count} />
          </div>
          <div className="mt-20 ">
            <PostCarousel list={posts} />
          </div>

          <div className="mt-12 ">
            <ContactRequestCarousel list={contactList} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MainPageTemplate
