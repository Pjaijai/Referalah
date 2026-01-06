import React from "react"

import { Icons } from "@/components/icons"

interface LinkedInBadgeProps {
  name?: string | null
  picture?: string | null
  onUnlink?: () => void
  isUnlinking?: boolean
  variant?: "full" | "simple" // full shows name and picture, simple shows just "Verified"
}

const LinkedInBadge: React.FC<LinkedInBadgeProps> = ({
  name,
  picture,
  onUnlink,
  isUnlinking = false,
  variant = "full",
}) => {
  return (
    <div className="relative flex flex-row items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
      <div className="flex h-6 w-6 items-center justify-center rounded bg-[#0A66C2]">
        <Icons.linkedin className="h-4 w-4 text-white" />
      </div>
      <span className="text-sm font-medium text-blue-600">
        {variant === "simple" ? "Verified" : name || "LinkedIn Verified"}
      </span>
      {variant === "full" && picture && (
        <img
          src={picture}
          alt="LinkedIn Profile"
          className="h-5 w-5 rounded-full"
          onError={(e) => {
            // Hide image if it fails to load
            e.currentTarget.style.display = "none"
          }}
        />
      )}
      {onUnlink && (
        <button
          onClick={onUnlink}
          disabled={isUnlinking}
          className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-400 text-white transition-colors hover:bg-slate-600 disabled:opacity-50"
          aria-label="Unlink LinkedIn"
        >
          {isUnlinking ? (
            <Icons.loader className="h-3 w-3 animate-spin" />
          ) : (
            <Icons.cross className="h-3 w-3" />
          )}
        </button>
      )}
    </div>
  )
}

export default LinkedInBadge
