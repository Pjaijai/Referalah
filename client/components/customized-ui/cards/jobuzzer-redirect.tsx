"use client"

import React from "react"
import { Briefcase, ExternalLink, Zap } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface IJobuzzerRedirectCardProps {
  className?: string
}

const JobuzzerRedirectCard: React.FunctionComponent<
  IJobuzzerRedirectCardProps
> = ({ className }) => {
  const handleVisitClick = () => {
    window.open("https://jobuzzer.com/", "_blank", "noopener,noreferrer")
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-4 shadow-md transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
          <Zap className="h-5 w-5 text-amber-600" />
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-3 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Find Jobs Faster
        </h3>

        <p className="text-sm leading-relaxed text-slate-600">
          <span className="font-semibold text-amber-700">JoBuzzer</span> helps
          you discover opportunities faster than
          <span className="font-semibold text-amber-700">
            {" "}
            LinkedIn and Indeed
          </span>
          .
        </p>

        <div className="rounded-md bg-white p-3 shadow-sm">
          <div className="space-y-2 text-left">
            <div className="flex items-start space-x-2">
              <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400">
                <Zap className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-slate-700">
                Real-time job alerts and opportunities
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400">
                <Briefcase className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-slate-700">
                Curated roles matched to your profile
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400">
                <Zap className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-slate-700">
                Faster response times from employers
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1"></div>

        <Button
          onClick={handleVisitClick}
          className="mt-auto flex w-full items-center justify-center space-x-2 bg-amber-600 px-4 py-2 font-medium text-white shadow-sm transition-all duration-200 hover:bg-amber-700 hover:shadow-md"
        >
          <span>Explore JoBuzzer</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default JobuzzerRedirectCard
