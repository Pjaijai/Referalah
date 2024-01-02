"use client"

import React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

const NavFooter = () => {
  return (
    <footer className="mt-2 flex flex-col items-center justify-center gap-2 border-t-2 p-2 md:flex-row ">
      <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground ">
        <div className="flex flex-row gap-3">
          <a aria-label="author-email" href="mailto:r1r69.referalah@gmail.com">
            <Icons.mail />
          </a>

          <Link
            aria-label="referalah-project-github"
            className="text-sm text-muted-foreground"
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
          >
            <Icons.github />
          </Link>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <Link
            className="text-center text-sm text-muted-foreground"
            href={siteConfig.page.privacyPolicy.href}
          >
            Privacy Policy
          </Link>

          <Link
            className="text-center text-sm text-muted-foreground"
            href={siteConfig.page.termsAndConditions.href}
          >
            Terms and Conditions
          </Link>

          <Link
            className="text-center text-sm text-muted-foreground"
            href={siteConfig.page.about.href}
          >
            {siteConfig.page.about.name}
          </Link>

          <Link
            className="text-center text-sm text-muted-foreground"
            href={siteConfig.page.contributors.href}
          >
            {siteConfig.page.contributors.name}
          </Link>

          <Link
            className="text-center text-sm text-muted-foreground"
            href={siteConfig.page.installation.href}
          >
            {siteConfig.page.installation.name}
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default NavFooter
