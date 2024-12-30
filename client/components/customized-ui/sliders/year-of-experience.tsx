import React from "react"

import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

interface IYearOfExperienceSliderProps {
  className?: string
  value: number[]
  onChange: (value: number) => void
}
const YearOfExperienceSlider: React.FunctionComponent<
  IYearOfExperienceSliderProps
> = ({ className, onChange, value }) => {
  const handleValueChange = (value: number[]) => {
    onChange(value[0])
  }
  return (
    <Slider
      defaultValue={[0]}
      max={10}
      step={1}
      min={0}
      value={value}
      className={cn(className)}
      onValueChange={handleValueChange}
      maxLabel="10+"
      minLabel="0"
    />
  )
}

export default YearOfExperienceSlider
