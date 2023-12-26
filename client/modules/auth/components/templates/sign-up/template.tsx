"use client"

import React from "react"
import { notFound } from "next/navigation"
import SignUpForm from "@/modules/auth/components/forms/sign-up"

import useUserStore from "@/hooks/state/user/store"

const SignUpPageTemplate = () => {
  const isUserSignIn = useUserStore((state) => state.isSignIn)

  if (isUserSignIn) throw notFound()
  return (
    <div className="flex h-full w-full justify-center">
      <div className="mt-8 h-full w-full max-w-[400px]">
        <SignUpForm />
      </div>
    </div>
  )
}

export default SignUpPageTemplate
