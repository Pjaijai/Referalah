"use client"

import React, { PropsWithChildren } from "react"

import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/store"
import HighlightedLink from "@/components/customized-ui/links/highlighted"

interface IAuthenticatedWrapperProps {}

const AuthenticatedPageWrapper: React.FunctionComponent<
  PropsWithChildren<IAuthenticatedWrapperProps>
> = ({ children }) => {
  const isUserSignIn = useUserStore((state) => state.isSignIn)

  if (!isUserSignIn)
    return (
      <div className="flex h-screen  flex-col items-center justify-center gap-4 rounded-lg  p-4">
        <span className="text-5xl">🥲</span>
        <h6>
          請先
          <HighlightedLink href={siteConfig.page.auth.href}>
            登入
          </HighlightedLink>
        </h6>
      </div>
    )
  return <>{children}</>
}

export default AuthenticatedPageWrapper
