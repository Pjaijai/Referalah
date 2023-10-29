import { ReactNode } from "react"

import { Icons } from "@/components/icons"

interface PageStatusHandlerProps {
  isLoading: boolean
  isSuccess: boolean
  error?: ReactNode | string
  children: ReactNode
}

const PageStatusHandler = ({
  error,
  isLoading,
  isSuccess,
  children,
}: PageStatusHandlerProps) => {
  if (isLoading)
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Icons.loader className="animate-spin text-2xl" />
      </div>
    )
  else if (!isSuccess)
    return (
      <div className="flex h-[500px] flex-col items-center justify-center gap-4">
        <span className="text-5xl">🥲</span>
        <h6>{error ?? "睇嚟有啲問題，請稍後再試。"}</h6>
      </div>
    )
  else return children
}

export default PageStatusHandler
