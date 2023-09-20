import React from "react"

import { Icons } from "@/components/icons"

const NavFooter = () => {
  return (
    <footer className="border-t-2 mt-12 p-2 flex flex-row items-center gap-2">
      <p className="text-muted-foreground text-sm">Created By R1R69</p>
      <p className="flex flex-row text-muted-foreground text-sm items-center gap-1">
        <Icons.mail />
        <span>r1r69.referalah@gmail.com</span>
      </p>
    </footer>
  )
}

export default NavFooter
