import React from "react"

import { Icons } from "@/components/icons"

interface ILoaderSpinnerProps {}
const LoaderSpinner = () => {
  return (
    <div className="flex h-screen items-center justify-center ">
      <Icons.loader className="animate-spin text-2xl" />
    </div>
  )
}

export default LoaderSpinner
