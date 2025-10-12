"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

const NavFooter = () => {
  const t = useI18n()
  const pathname = usePathname()

  const hideFooterPageList = [
    siteConfig.page.chat.href,
    siteConfig.page.profile.href,
    siteConfig.page.editProfile.href,
  ]

  const noMargin = [siteConfig.page.createJobJourney.href]

  const notMargin = noMargin.some((path) => pathname.includes(path))
  const noShowFooter = hideFooterPageList.some((path) =>
    pathname.includes(path)
  )
  return (
    <footer
      className={cn(
        noShowFooter
          ? "hidden"
          : "z-10  flex flex-col items-center justify-between gap-2 border-t-2 bg-black px-4 py-2 text-white md:flex-row md:bg-slate-50 md:text-muted-foreground",
        notMargin ? "mt-0" : "mt-12"
      )}
    >
      <div className="flex flex-row-reverse  gap-[60px] ">
        <a aria-label="author-email" href="mailto:referalah@gmail.com">
          <Icons.mail />
        </a>

        <Link
          aria-label="buy-me-a-coffee"
          className="text-sm "
          href={siteConfig.links.buyMeACoffee}
          target="_blank"
          rel="noreferrer"
        >
          <Icons.coffee />
        </Link>

        <Link
          aria-label="referalah-project-instagram"
          className="text-sm "
          href={siteConfig.links.instagram}
          target="_blank"
          rel="noreferrer"
        >
          <Icons.instagram />
        </Link>

        <Link
          aria-label="referalah-project-github"
          className="text-sm "
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
        >
          <Icons.github />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:flex md:flex-row md:justify-around">
        <Link
          className="p-2 text-center text-sm  "
          href={siteConfig.page.contributors.href}
        >
          {t("page.contributors")}
        </Link>

        <Link
          className="p-2 text-center text-sm  "
          href={siteConfig.page.installation.href}
        >
          {t("page.installation")}
        </Link>

        <Link
          className="p-2 text-center text-sm "
          href={siteConfig.page.privacyPolicy.href}
        >
          {t("auth.sign_up.privacy_policy")}
        </Link>

        <Link
          className="p-2 text-center text-sm "
          href={siteConfig.page.termsAndConditions.href}
        >
          {t("auth.sign_up.terms_and_conditions")}
        </Link>
      </div>
    </footer>
  )
}

export default NavFooter
