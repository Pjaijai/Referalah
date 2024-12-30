"use client"

import React, { PropsWithChildren } from "react"
import { useI18n } from "@/utils/services/internationalization/client"

import { siteConfig } from "@/config/site"
import useUserStore from "@/hooks/state/user/store"
import HighlightedLink from "@/components/customized-ui/links/highlighted"

interface IAuthenticatedWrapperProps {}

const AuthenticatedPageWrapper: React.FunctionComponent<
  PropsWithChildren<IAuthenticatedWrapperProps>
> = ({ children }) => {
  const t = useI18n()
  const isUserSignIn = useUserStore((state) => state.isSignIn)

  if (!isUserSignIn)
    return (
      <div className="flex h-screen  flex-col items-center justify-center gap-4 rounded-lg  p-4">
        <span className="text-5xl">🥲</span>
        <h6 className="flex flex-row gap-1">
          {t("general.please")}
          <HighlightedLink href={siteConfig.page.signIn.href}>
            {t("general.sign_in")}
          </HighlightedLink>
        </h6>
      </div>
    )
  return <>{children}</>
}

export default AuthenticatedPageWrapper
