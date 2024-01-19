"use client"

import React from "react"
import Link from "next/link"
import SignInTab from "@/modules/auth/components/tabs/sign-in"
import { useI18n } from "@/utils/services/internationalization/client"

import { siteConfig } from "@/config/site"

const SignInPageTemplate = () => {
  const t = useI18n()
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <SignInTab />
      <p className="mt-8 w-full text-center  font-normal ">
        {t("auth.sign_in.no_account")}
        <Link
          href={siteConfig.page.signUp.href}
          className=" border-b border-foreground"
        >
          {t("auth.sign_in.register_here")}
        </Link>
      </p>
    </div>
  )
}

export default SignInPageTemplate
