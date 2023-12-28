"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import CommonPageLayout from "@/components/layouts/common"

const NotFound = () => {
  const router = useRouter()
  const handleClick = () => {
    router.back()
  }
  return (
    <CommonPageLayout>
      <div className="flex h-[500px] flex-col items-center justify-center gap-4">
        <span className="text-5xl">🥲😢</span>
        <h6>{"404 Not Found"}</h6>
        <Button type="button" onClick={handleClick}>
          返回
        </Button>
      </div>
    </CommonPageLayout>
  )
}

export default NotFound
