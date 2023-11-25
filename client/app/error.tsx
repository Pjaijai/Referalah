"use client"

import { Button } from "@/components/ui/button"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  return (
    <div className="flex h-[500px] flex-col items-center justify-center gap-4">
      <span className="text-5xl">🥲😢</span>
      <h6>{error.message || "Something went wrong"}</h6>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}

export default GlobalError
