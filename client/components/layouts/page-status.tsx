import { ReactNode } from "react"

import { Icons } from "@/components/icons"

interface PageStatusLayoutProps {
  isLoading: boolean
  isSuccess: boolean
  error?: Error | string
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
    throw error
  } else {
    return children ? <>{children}</> : null
  }
}

export default PageStatusLayout
