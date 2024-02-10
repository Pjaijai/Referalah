"use client"

import React from "react"
import Link from "next/link"
import UserCount from "@/modules/main/components/user-count"
import { useScopedI18n } from "@/utils/services/internationalization/client"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useUserStore from "@/hooks/state/user/store"
import { buttonVariants } from "@/components/ui/button"

const MainPageTemplate = ({ count }: { count: number | null }) => {
  const isUserSignIn = useUserStore((state) => state.isSignIn)

  const scopedT = useScopedI18n("index")

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-row justify-center md:justify-between">
        <div className="flex flex-col justify-center">
          <div className="mt-4 flex justify-center md:justify-start">
            <div className="flex w-full flex-col items-center  text-5xl font-bold md:flex-row md:text-4xl">
              <div className="flex shrink-0 flex-row text-center">
                <h2>{scopedT("connect")}</h2>
              </div>

              <h2 className="ml-1 text-green-700 dark:text-yellow-300 ">
                {scopedT("professionals")}
              </h2>
            </div>
          </div>

          <div className="mt-2 flex max-w-[700px] flex-col text-center text-base text-foreground  md:flex-row md:text-start md:text-lg">
            <p>{scopedT("subTitle")}</p>
          </div>
        </div>
      </div>

      <div className={"flex justify-center md:justify-start"}>
        <div className="flex flex-col  items-center gap-2 md:flex-row">
          {isUserSignIn && (
            <Link
              href={siteConfig.page.referrerPost.href}
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "lg",
                }),
                "rounded-xl p-8  text-2xl font-bold md:p-4 md:text-base"
              )}
            >
              {scopedT("check_latest_post")}
            </Link>
          )}

          {!isUserSignIn && (
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

          <UserCount numberOfMembers={count} />
        </div>
      </div>
    </section>
  )
}

export default MainPageTemplate
