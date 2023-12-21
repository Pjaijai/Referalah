"use client"

import Link from "next/link"
import {
  useI18n,
  useScopedI18n,
} from "@/utils/services/internationalization/client"

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
      <div className="mt-4 flex justify-center md:hidden">
        <BaseNavigationMenu />
      </div>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl  md:text-4xl">{scopedT("title")}</h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            {scopedT("subTitle")}
          </p>
        </div>
        <div className={"flex flex-wrap gap-4"}>
          <Link
            href={siteConfig.links.instagram}
            className={cn(
              buttonVariants({ variant: isUserSignIn ? "default" : "outline" }),
              "gap-2"
            )}
          >
            <Icons.instagram />
            Instagram
          </Link>
          {!isUserSignIn && (
            <Link
              href={siteConfig.page.signUp.href}
              className={buttonVariants({ variant: "default" })}
            >
              註冊
            </Link>
          )}
          <h2 className="mt-4  flex flex-row gap-1 border-b-2 border-green-700 text-end text-sm dark:border-yellow-300">
            <span
              className="
font-bold text-green-700  dark:text-yellow-300"
            >
              {data || "0"}
            </span>
            {scopedT("members", { count: 1 })}
          </h2>
        </div>
      </section>
    </>
  )
}
