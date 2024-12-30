import React, { PropsWithChildren } from "react"
import { formatLocation } from "@/utils/common/helpers/format/location"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

// TODO: Remove
interface ILocationDisplayProps {
  city: string | null
  province: string | null
  country: string | null
  className?: string
}
const LocationDisplay: React.FunctionComponent<
  PropsWithChildren<ILocationDisplayProps>
> = ({ city, province, country, className }) => {
  return (
    <div className={cn("flex items-center justify-start", className)}>
      <div>
        <Icons.location width="18" height="18" />
      </div>
      <span className="ml-1">{formatLocation(city, province, country)}</span>
    </div>
  )
}

export default LocationDisplay
