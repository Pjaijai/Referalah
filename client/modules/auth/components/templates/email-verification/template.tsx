"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { EEmaiVerification } from "@/modules/auth/types/email-verification"
import { useI18n } from "@/utils/services/internationalization/client"

import { Button } from "@/components/ui/button"

const EmailVerificationPageTemplate = () => {
  const t = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const type = searchParams.get("type")
  const email = searchParams.get("email")
  const [seconds, setSeconds] = useState(60)

  if (!type || !email) throw Error

  const redirectUrl = "/"

  const title = useMemo(() => {
    if (type === EEmaiVerification.RESET_PASSWORD)
      return t("auth.email_verification.click_link_in_email_to_reset_password")
    return t("auth.email_verification.click_link_in_email_to_verify")
  }, [type])

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          clearInterval(intervalId) // Stop the countdown when it reaches 0
          // You can perform additional actions when the countdown reaches 0
          return 0
        } else {
          return prevSeconds - 1
        }
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="flex h-full w-full justify-center ">
      <div className="mt-8 w-full max-w-lg text-center">
        <h6 className="text-lg">{title}</h6>
        <Button onClick={redirectToEmail} className="mt-4 w-full" size={"sm"}>
          {t("auth.email_verification.open_mail_box")}
        </Button>
        <p className="mt-4 text-xs">
          {t("auth.email_verification.check_spam_mail_box")}{" "}
          <span className="font-semibold">team@referalah.com</span>
        </p>
        {type === EEmaiVerification.RESET_PASSWORD && seconds === 0 && (
          <p className="mt-2 text-xs">
            {t("general.or")}{" "}
            <Link href={redirectUrl} className="border-b border-foreground">
              {t("auth.email_verification.resend_email")}
            </Link>
          </p>
        )}

        {type === EEmaiVerification.RESET_PASSWORD && seconds > 0 && (
          <p className="mt-2 text-xs">
            {t("auth.email_verification.resend_link_later", {
              count: seconds,
            })}
          </p>
        )}
      </div>
    </div>
  )
}

export default EmailVerificationPageTemplate
