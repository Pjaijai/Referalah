import React from "react"
import { Badge } from "lucide-react"

interface IReferralBadgeProps {
  title: string
}
const ReferralBadge: React.FunctionComponent<IReferralBadgeProps> = ({
  title,
}) => {
  return (
    <Badge className="w-fit rounded-xl bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
      {title}
    </Badge>
  )
}

export default ReferralBadge
