"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useI18n } from "@/utils/services/internationalization/client"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import DonationButton from "@/components/customized-ui/buttons/donation"
import { Icons } from "@/components/icons"

const NavFooter = () => {
  const t = useI18n()
  const pathname = usePathname()
  const noShowFooter = pathname.includes(siteConfig.page.chat.href)
  return (
    <footer
      className={cn(
        noShowFooter
          ? "hidden"
          : "mt-12 flex flex-col items-center justify-center gap-2 border-t-2 p-2 md:flex-row "
      )}
    >
      <div className="flex w-full flex-col items-center gap-3 text-sm text-muted-foreground md:w-fit">
        <div className="flex w-full flex-row  justify-around gap-3 ">
          <a aria-label="author-email" href="mailto:r1r69.referalah@gmail.com">
            <Icons.mail />
          </a>

          <Link
            aria-label="referalah-project-github"
            className="text-sm text-muted-foreground"
            href={siteConfig.links.instagram}
            target="_blank"
            rel="noreferrer"
          >
            <Icons.instagram />
          </Link>

          <Link
            aria-label="referalah-project-github"
            className="text-sm text-muted-foreground"
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
          >
            <Icons.github />
          </Link>

          <DonationButton />
        </div>

        <div className="flex flex-wrap justify-around gap-3">
          <Link
            className="p-2 text-center text-sm text-muted-foreground "
            href={siteConfig.page.contributors.href}
          >
            {t("page.contributors")}
          </Link>

          <Link
            className="p-2 text-center text-sm text-muted-foreground "
            href={siteConfig.page.installation.href}
          >
            {t("page.installation")}
          </Link>

          <Link
            className="p-2 text-center text-sm text-muted-foreground "
            href={siteConfig.page.about.href}
          >
            {t("page.about")}
          </Link>
          <Link
            className="p-2 text-center text-sm text-muted-foreground"
            href={siteConfig.page.privacyPolicy.href}
          >
            {t("auth.sign_up.privacy_policy")}
          </Link>

          <Link
            className="p-2 text-center text-sm text-muted-foreground "
            href={siteConfig.page.termsAndConditions.href}
          >
            {t("auth.sign_up.terms_and_conditions")}
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default NavFooter
