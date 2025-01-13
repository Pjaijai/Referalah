"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  minLabel?: string
  maxLabel?: string
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, minLabel, maxLabel, ...props }, ref) => (
  <div className="relative flex flex-col">
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-4 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-indigo-600" />
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb className="relative block h-5 w-5 rounded-full  bg-background shadow-md ring-offset-background transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50">
        {Array.isArray(props.value) &&
          props.value.length > 0 &&
          props.value[0] > 0 && (
            <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 text-center text-sm text-indigo-600">
              {props.value[0]}
            </div>
          )}
      </SliderPrimitive.Thumb>

      {/* Absolute positioned labels */}
      <div className="absolute -bottom-6 left-0 text-xs text-slate-600">
        {minLabel}
      </div>
      <div className="absolute -bottom-6 right-0 text-xs text-slate-600">
        {maxLabel}
      </div>
    </SliderPrimitive.Root>
  </div>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
