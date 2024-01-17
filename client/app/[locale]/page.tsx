"use client"

import Link from "next/link"
import UserCount from "@/modules/main/components/user-count"
import { useScopedI18n } from "@/utils/services/internationalization/client"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import useGetUserCount from "@/hooks/api/user/get-user-count"
import useUserStore from "@/hooks/state/user/store"
import { buttonVariants } from "@/components/ui/button"
import { BaseNavigationMenu } from "@/components/customized-ui/navigation-menu/base"
import { Icons } from "@/components/icons"

export default function IndexPage() {
  const isUserSignIn = useUserStore((state) => state.isSignIn)
  const { data } = useGetUserCount()
  const scopedT = useScopedI18n("index")

  return (
    <>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex flex-row justify-center md:justify-between">
          <div className="flex flex-col justify-center">
            <div className="mt-4 flex justify-center md:justify-start">
              <div className="flex flex-col text-6xl  font-bold md:flex-row md:text-4xl">
                <div className="flex flex-row">
                  <h2>{scopedT("connect")}</h2>
                  <h2>{scopedT("scattered")}</h2>
                </div>
                <div className="flex flex-row">
                  <h2>{scopedT("hongkong")}</h2>
                  <h2 className="  text-green-700 dark:text-yellow-300  ">
                    {scopedT("professionals")}
                  </h2>
                </div>
              </div>
            </div>

            <div className="mt-2 flex max-w-[700px] flex-col text-center text-base text-foreground  md:flex-row md:text-start md:text-lg">
              <p>{scopedT("subTitle_one")}</p>
              <p>{scopedT("subTitle_two")}</p>
            </div>
          </div>
          <div className="hidden md:block">
            <UserCount numberOfMembers={data} />
          </div>
        </div>

        <div className={"flex justify-center md:justify-start"}>
          <div className="flex flex-col items-center">
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
                查看最新街招
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
                即刻加入！
              </Link>
            )}
            <div className="block md:hidden">
              <UserCount numberOfMembers={data} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
