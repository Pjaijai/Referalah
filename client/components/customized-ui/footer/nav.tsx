import React from "react"

import { Icons } from "@/components/icons"
import Link from "next/link";

const NavFooter = () => {
  return (
    <footer className="border-t-2 mt-12 p-2 flex flex-row items-center gap-2">
      <p className="text-muted-foreground text-sm">Created By R1R69</p>
      <p className="flex flex-row text-muted-foreground text-sm items-center gap-1">
        <Icons.mail />
        <span>r1r69.referalah@gmail.com</span>
      </p>
      <Link className="text-muted-foreground text-sm" href={"/privacy"}>
        Privacy Policy
      </Link>
    </footer>
  )
}

export default NavFooter
