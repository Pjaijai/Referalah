"use client"

import React, { PropsWithChildren } from "react"
import { notFound } from "next/navigation"

import useUserStore from "@/hooks/state/user/store"

interface IUnauthenticatedPageWrapperProps {}

const UnauthenticatedPageWrapper: React.FunctionComponent<
  PropsWithChildren<IUnauthenticatedPageWrapperProps>
> = ({ children }) => {
  const isUserSignIn = useUserStore((state) => state.isSignIn)

  if (isUserSignIn) return notFound()

  return <>{children}</>
}

export default UnauthenticatedPageWrapper
