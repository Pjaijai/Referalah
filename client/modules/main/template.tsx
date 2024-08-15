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
    <div className="relative mt-72 flex h-screen w-full flex-row items-center justify-center md:mt-16 md:h-auto ">
      <div className="relative z-30 mx-auto h-fit w-full max-w-7xl overflow-hidden  p-4 ">
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
          <div className="flex flex-col items-center justify-center text-5xl font-black text-black dark:text-white md:flex-row md:text-4xl">
            <h2 className="flex shrink-0 flex-row text-center">
              {scopedT("connect")}
            </h2>

            <h2 className=" text-indigo-600 md:ml-3">
              {scopedT("professionals")}
            </h2>
          </div>
          <div className="text-inter mt-6 flex flex-row justify-center  text-base text-foreground md:text-start md:text-lg">
            <div className="flex flex-col items-center justify-center">
              <p className="text-xl font-extralight italic">
                &quot;{scopedT("subTitle")}&quot;
              </p>

              <p className="text-base font-extralight">Referalah</p>
            </div>
          </div>

          <div className="mt-8 flex w-full flex-row justify-center">
            {isUserSignIn ? (
              <Link
                href={siteConfig.page.searchPost.href}
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "lg",
                  }),
                  "rounded-md bg-indigo-600  p-4 text-xl font-bold hover:bg-indigo-600 md:p-4 md:text-base"
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
                  "rounded-md bg-indigo-600  p-4 text-xl font-bold hover:bg-indigo-600 md:p-4 md:text-base"
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

          <div className="mt-12 p-4">
            <ContactRequestCarousel list={contactList} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MainPageTemplate
