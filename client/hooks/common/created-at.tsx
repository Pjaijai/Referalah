import { useMemo } from "react"
import { formatDate } from "@/utils/common/helpers/format/date"
import compareDateDifferenceHelper from "@/utils/common/helpers/time/compareDateDifference"

const useCreatedAt = ({ createdAt }: { createdAt: string | null }) => {
  const formattedCreatedAt = useMemo(() => {
    if (!createdAt) return "- -"
    const dayDiff = compareDateDifferenceHelper({
      oldDate: createdAt,
      newDate: new Date().toISOString(),
      unit: "day",
    })

    if (dayDiff > 7 && dayDiff <= 364) return `${Math.ceil(dayDiff / 7)}w`

    if (dayDiff > 0 && dayDiff <= 7) return `${dayDiff}d`

    const minuteDiff = compareDateDifferenceHelper({
      oldDate: createdAt,
      newDate: new Date().toISOString(),
      unit: "minute",
    })

    if (minuteDiff > 60 && minuteDiff <= 1440)
      return `${Math.ceil(minuteDiff / 60)}h`
    if (minuteDiff > 0 && minuteDiff <= 60) return `${minuteDiff}m`
    if (minuteDiff === 0) return "now"
    return formatDate("DD/MM/YY")
  }, [createdAt])

  return {
    data: formattedCreatedAt,
  }
}

export default useCreatedAt
