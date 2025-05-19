"use client"

import React from "react"

import BaseAvatar from "@/components/customized-ui/avatars/base"
import { Icons } from "@/components/icons"

const CompanyAvatar = () => {
  return (
    <div>
      <BaseAvatar
        url={"photoUrl"}
        alt={"username"}
        fallBack={<Icons.buildings />}
        size="medium"
        className="h-[100px] w-[100px] "
      />
    </div>
  )
}

export default CompanyAvatar
