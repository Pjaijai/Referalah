"use client"

import React from "react"
import Link from "next/link"
import SignInTab from "@/modules/auth/components/tabs/sign-in"

import { siteConfig } from "@/config/site"

const SignInPageTemplate = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <SignInTab />
      <p className="mt-8 w-full text-center  font-normal ">
        未有帳號？係
        <Link
          href={siteConfig.page.signUp.href}
          className=" border-b border-foreground"
        >
          呢度註冊
        </Link>
      </p>
    </div>
  )
}

export default SignInPageTemplate
