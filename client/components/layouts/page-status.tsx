import { ReactNode } from "react"

import { Icons } from "@/components/icons"

interface PageStatusLayoutProps {
  isLoading: boolean
  isSuccess: boolean
  error?: ReactNode | string
  children: ReactNode
}

// TODO : Convert this to page fallback and apply on all page
const PageStatusLayout = ({
  error,
  isLoading,
  isSuccess,
  children,
}: PageStatusLayoutProps) => {
  if (isLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Icons.loader className="animate-spin text-2xl" />
      </div>
    )
  } else if (!isSuccess) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center gap-4">
        <span className="text-5xl">🥲</span>
        <h6>{error ?? "睇嚟有啲問題，請稍後再試。"}</h6>
      </div>
    )
  } else {
    return children ? <>{children}</> : null
  }
}

export default PageStatusLayout
