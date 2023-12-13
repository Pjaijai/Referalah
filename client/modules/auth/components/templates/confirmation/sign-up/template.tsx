"use client"

import React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/store"
import { buttonVariants } from "@/components/ui/button"

const SignUpConfirmationPageTemplate = () => {
  const userUuid = useUserStore((state) => state.uuid)

  return (
    <div className="flex h-full w-full justify-center ">
      <div className="mt-8 flex w-full max-w-md flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <p> 你已成功核實並成為會員會。</p>
          <p> 即刻建立你嘅個人檔案開始搵工啦！</p>
        </div>

        <Link
          href={`${siteConfig.page.profile.href}/${userUuid}`}
          className={buttonVariants({ className: "w-full" })}
        >
          建立個人檔案
        </Link>

        <Link
          href={siteConfig.page.main.href}
          className={buttonVariants({ variant: "link", size: "sm" })}
        >
          略過
        </Link>
      </div>
    </div>
  )
}

export default SignUpConfirmationPageTemplate
