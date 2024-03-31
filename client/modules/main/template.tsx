"use client"

import React, { useRef } from "react"
import Link from "next/link"
import PostCarousel from "@/modules/main/components/post-carousel"
import UserCount from "@/modules/main/components/user-count"
import { useScopedI18n } from "@/utils/services/internationalization/client"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

import { ISearchPostResponse } from "@/types/api/response/referer-post"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useUserStore from "@/hooks/state/user/store"
import { buttonVariants } from "@/components/ui/button"
import { BackgroundBeams } from "@/components/customized-ui/fancy/background-beams/base"
import { Globe } from "@/components/customized-ui/fancy/globe/globe"

const MainPageTemplate = ({
  count,
  posts,
}: {
  count: number | null
  posts: ISearchPostResponse[]
}) => {
  const isUserSignIn = useUserStore((state) => state.isSignIn)
  const { theme } = useTheme()
  const initialTheme = useRef({ value: theme })

  const scopedT = useScopedI18n("index")

  return (
    <div className="relative mt-2 flex h-screen w-full flex-row items-center justify-center md:h-auto">
      <div className="relative z-30 mx-auto h-full w-full max-w-7xl overflow-hidden  p-4 md:h-[40rem]">
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
          <div className="flex flex-col items-center justify-center text-5xl font-bold text-black dark:text-white md:flex-row md:text-4xl">
            <h2 className="flex shrink-0 flex-row text-center">
              {scopedT("connect")}
            </h2>

            <h2 className="ml-1  text-green-700 dark:text-yellow-300 ">
              {scopedT("professionals")}
            </h2>
          </div>
          <div className="mt-2 flex flex-row  justify-center text-base text-foreground md:text-start md:text-lg">
            <p>{scopedT("subTitle")}</p>
          </div>
          <div className="flex flex-row justify-center md:justify-end">
            <UserCount numberOfMembers={count} />
          </div>

          <div className="mt-8 flex w-full flex-row justify-center">
            {isUserSignIn ? (
              <Link
                href={siteConfig.page.referrerPost.href}
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "lg",
                  }),
                  "rounded-xl p-8 text-2xl font-bold md:p-4 md:text-base"
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
                  "rounded-xl p-8  text-2xl font-bold md:p-4 md:text-base"
                )}
              >
                {scopedT("join_now")}
              </Link>
            )}
          </div>
          <div className="mt-20 ">
            <PostCarousel list={posts} />
          </div>
        </motion.div>
      </div>

      {initialTheme.current.value !== theme && (
        <div className="absolute top-0 h-full w-full">
          <Globe />
        </div>
      )}
      {initialTheme.current.value === theme && (
        <div className="fixed top-0 z-0 h-full w-full">
          <BackgroundBeams />
        </div>
      )}
    </div>
  )
}

export default MainPageTemplate
