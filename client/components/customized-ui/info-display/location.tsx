import React, { PropsWithChildren } from "react"
import { formatLocation } from "@/utils/common/helpers/format/location"

import { Icons } from "@/components/icons"

interface ILocationDisplayProps {
  city: string | null
  province: string | null
  country: string | null
}
const LocationDisplay: React.FunctionComponent<
  PropsWithChildren<ILocationDisplayProps>
> = ({ city, province, country }) => {
  return (
    <div className="flex items-center justify-start">
      <Icons.location width="18" />
      <span className="ml-1">{formatLocation(city, province, country)}</span>
    </div>
  )
}

export default LocationDisplay
