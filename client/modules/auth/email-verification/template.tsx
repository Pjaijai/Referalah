"use client"

import React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { EEmaiVerification } from "@/modules/auth/types/email-verification"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"

const EmailVerificationPageTemplate = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const type = searchParams.get("type")
  const email = searchParams.get("email")

  if (!type || !email) throw Error

  const redirectUrl =
    type === EEmaiVerification.MAGIC_LINK ? siteConfig.page.signIn.href : "/"

  const getEmailProvider = (email: string) => {
    // Extract the email provider from the email address
    const emailParts = email.split("@")
    return emailParts.length === 2 ? emailParts[1] : null
  }
  const redirectToEmail = () => {
    if (!email) return

    const emailProvider = getEmailProvider(email)

    if (emailProvider) {
      const emailUrl = `https://${emailProvider}`
      router.push(emailUrl)
    } else {
      console.error("Could not determine email provider")
    }
  }

  return (
    <div className="flex h-full w-full justify-center ">
      <div className="mt-8 w-full max-w-md text-center">
        <h6 className="text-lg"> 請撳電郵入面嘅 magic link 嚟登入。</h6>
        <Button onClick={redirectToEmail} className="mt-4 w-full" size={"sm"}>
          打開郵箱
        </Button>
        <p className="mt-4 text-xs">
          請查看垃圾郵箱，相關電郵地址{" "}
          <span className="font-semibold">team@referalah.com</span>
        </p>
        <p className="mt-2 text-xs">
          或{" "}
          <Link href={redirectUrl} className="border-foreground hover:border-b">
            重新發送連結
          </Link>
        </p>
      </div>
    </div>
  )
}

export default EmailVerificationPageTemplate
