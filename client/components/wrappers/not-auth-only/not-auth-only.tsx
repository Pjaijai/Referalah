"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"

import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/store"

interface NotAuthOnlyWrapperProps {
  children: React.ReactNode
}
const NotAuthOnlyWrapper: React.FunctionComponent<NotAuthOnlyWrapperProps> = ({
  children,
}) => {
  const isUserSignIn = useUserStore().isSignIn
  const router = useRouter()
  useEffect(() => {
    if (isUserSignIn) {
      router.push(siteConfig.page.main.href)
    }
  }, [isUserSignIn])

  return <div>{children}</div>
}

export default NotAuthOnlyWrapper
