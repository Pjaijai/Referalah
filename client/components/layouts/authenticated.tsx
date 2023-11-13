"use client"

import React, { PropsWithChildren, useEffect } from "react"
import router from "next/navigation"

import useUserStore from "@/hooks/state/user/store"

interface IAuthenticatedLayoutProps {}

const AuthenticatedPageLayout: React.FunctionComponent<
  PropsWithChildren<IAuthenticatedLayoutProps>
> = ({ children }) => {
  const isUserSignIn = useUserStore((state) => state.isSignIn)

  if (!isUserSignIn) return <div>123</div>
  return <>{children}</>
}

export default AuthenticatedPageLayout
