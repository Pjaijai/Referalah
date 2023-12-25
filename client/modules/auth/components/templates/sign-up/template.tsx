import React from "react"
import SignUpForm from "@/modules/auth/components/forms/sign-up"

const SignUpPageTemplate = () => {
  return (
    <div className="flex h-full w-full justify-center">
      <div className="mt-8 h-full w-full max-w-[400px]">
        <SignUpForm />
      </div>
    </div>
  )
}

export default SignUpPageTemplate
