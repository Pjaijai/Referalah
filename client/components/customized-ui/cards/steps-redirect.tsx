"use client"

import React from "react"
import { BarChart3, Clock, ExternalLink, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface IStepsRedirectCardProps {
  className?: string
}

const StepsRedirectCard: React.FunctionComponent<IStepsRedirectCardProps> = ({
  className,
}) => {
  const handleVisitClick = () => {
    window.open("https://steps.fyi/", "_blank", "noopener,noreferrer")
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col rounded-lg border-2 border-slate-200 bg-gradient-to-br from-white to-slate-100 p-4 shadow-md transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <Clock className="h-5 w-5 text-slate-600" />
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-3 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Track Your Immigration Journey
        </h3>

        <p className="text-sm leading-relaxed text-slate-600">
          Submitted your HK pathway PR or work permit?{" "}
          <span className="font-semibold text-slate-700">steps.fyi</span>{" "}
          provides real timeline data to make the process more transparent.
        </p>

        <div className="rounded-md bg-white p-3 shadow-sm">
          <div className="space-y-2 text-left">
            <div className="flex items-start space-x-2">
              <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-400">
                <BarChart3 className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-slate-700">
                Share your timeline anonymously
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-400">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-slate-700">
                View other people&apos;s processing times
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-400">
                <Clock className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm text-slate-700">
                Get data-driven insights for your case
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1"></div>

        <Button
          onClick={handleVisitClick}
          className="mt-auto flex w-full items-center justify-center space-x-2 bg-slate-600 px-4 py-2 font-medium text-white shadow-sm transition-all duration-200 hover:bg-slate-700 hover:shadow-md"
        >
          <span>Visit steps.fyi</span>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default StepsRedirectCard
