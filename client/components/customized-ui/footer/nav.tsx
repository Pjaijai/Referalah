import React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

const NavFooter = () => {
  return (
    <footer className="mt-12 flex flex-col items-center justify-between gap-2 border-t-2 p-2 md:flex-row">
      <p className="text-sm text-muted-foreground">Created By R1R69</p>
      <p className="flex flex-row items-center gap-1 text-sm text-muted-foreground">
        <Icons.mail />
        <span>r1r69.referalah@gmail.com</span>
      </p>
      <div className="flex gap-2">
        <Link
          className="text-sm text-muted-foreground"
          href={siteConfig.page.privacyPolicy.href}
        >
          Privacy Policy
        </Link>
        <Link
          className="text-sm text-muted-foreground"
          href={siteConfig.page.termsAndConditions.href}
        >
          Terms and Conditions
        </Link>
      </div>
    </footer>
  )
}

export default NavFooter
