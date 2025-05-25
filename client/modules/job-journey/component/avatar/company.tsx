"use client"

import React from "react"

import { cn } from "@/lib/utils"
import BaseAvatar from "@/components/customized-ui/avatars/base"
import { Icons } from "@/components/icons"

type TCompanyAvatarProps = {
  url?: string
  alt: string | null
  className?: string
}
const CompanyAvatar = (props: TCompanyAvatarProps) => {
  return (
    <div>
      <BaseAvatar
        url={props.url}
        alt={props.alt}
        fallBack={<Icons.buildings />}
        size="medium"
        className={cn("h-[100px] w-[100px]", props.className)}
      />
    </div>
  )
}

export default CompanyAvatar
