"use client"

import React from "react"
import { Coffee, ExternalLink } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface IDonationCardProps {
  className?: string
}

const DonationCard: React.FunctionComponent<IDonationCardProps> = ({
  className,
}) => {
  const handleDonateClick = () => {
    window.open(siteConfig.links.buyMeACoffee, "_blank", "noopener,noreferrer")
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col rounded-lg border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 shadow-md transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-center space-x-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
          <Coffee className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-4 text-center">
        <h3 className="text-xl font-semibold text-slate-800">
          Support Referalah
        </h3>

        <p className="text-sm leading-relaxed text-slate-600">
          Help keep this platform running and support our community! Your
          contributions go towards:
        </p>

        <div className="space-y-2 text-left">
          <div className="flex items-start space-x-2">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-400"></div>
            <span className="text-sm text-slate-600">
              Platform running fees (hosting, domains, services)
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-400"></div>
            <span className="text-sm text-slate-600">
              Coffee for contributors and maintainers
            </span>
          </div>
        </div>

        <div className="flex-1"></div>

        <Button
          onClick={handleDonateClick}
          className="mt-auto flex w-full items-center justify-center space-x-2 bg-indigo-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-indigo-700"
        >
          <Coffee className="h-4 w-4" />
          <span>Buy Me a Coffee</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default DonationCard
