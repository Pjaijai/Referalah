"use client"

import React from "react"
import Link from "next/link"
import { useI18n } from "@/utils/services/internationalization/client"

import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/store"
import { buttonVariants } from "@/components/ui/button"

const SignUpConfirmationPageTemplate = () => {
  const userUuid = useUserStore((state) => state.uuid)
  const t = useI18n()

  return (
    <div className="flex h-full w-full justify-center ">
      <div className="mt-8 flex w-full max-w-lg flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <p> {t("auth.sign_up_confirmation.verification_success_text")}</p>
          <p> {t("auth.sign_up_confirmation.build_your_profile")}</p>
        </div>

        <Link
          href={`${siteConfig.page.profile.href}/${userUuid}`}
          className={buttonVariants({ className: "w-full" })}
        >
          {t("auth.sign_up_confirmation.build_my_profile")}
        </Link>

        <Link
          href={siteConfig.page.main.href}
          className={buttonVariants({ variant: "link", size: "sm" })}
        >
          {t("general.skip")}
        </Link>
      </div>
    </div>
  )
}

export default SignUpConfirmationPageTemplate
