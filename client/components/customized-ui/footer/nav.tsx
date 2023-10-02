import React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

const NavFooter = () => {
  return (
    <footer className="border-t-2 mt-12 p-2 flex flex-col md:flex-row items-center gap-2 justify-between">
      <p className="text-muted-foreground text-sm">Created By R1R69</p>
      <p className="flex flex-row text-muted-foreground text-sm items-center gap-1">
        <Icons.mail />
        <span>r1r69.referalah@gmail.com</span>
      </p>
      <div className="flex gap-2">
        <Link
          className="text-muted-foreground text-sm"
          href={siteConfig.page.privacyPolicy.href}
        >
          Privacy Policy
        </Link>
        <Link
          className="text-muted-foreground text-sm"
          href={siteConfig.page.privacyPolicy.href}
        >
          Terms and Conditions
        </Link>
      </div>
    </footer>
  )
}

export default NavFooter
