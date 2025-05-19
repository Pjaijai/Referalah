import React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

const NotFoundTemplate = () => {
  const router = useRouter()
  const handleClick = () => {
    router.back()
  }
  return (
    <div className="flex h-[500px] flex-col items-center justify-center gap-4">
      <span className="text-5xl">🥲😢</span>
      <h6>{"404 Not Found"}</h6>
      <Button type="button" onClick={handleClick}>
        返回
      </Button>
    </div>
  )
}

export default NotFoundTemplate
