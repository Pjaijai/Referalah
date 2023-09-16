"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import CreatePostTemplate from "@/modules/post/create/template"

import useUserStore from "@/hooks/state/user/useUserStore"

const CreatePostPage = () => {
  const isUserSignIn = useUserStore((state) => state.isSignIn)
  const router = useRouter()

  useEffect(() => {
    if (!isUserSignIn) {
      router.push("/")
    }
  }, [])

  return (
    <div>
      <CreatePostTemplate />
    </div>
  )
}

export default CreatePostPage
