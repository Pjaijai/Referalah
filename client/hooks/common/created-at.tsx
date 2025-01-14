import { useMemo } from "react"
import compareDateDifferenceHelper from "@/utils/common/helpers/time/compare-date-difference"

const useCreatedAt = ({ createdAt }: { createdAt: string | null }) => {
  const formattedCreatedAt = useMemo(() => {
    if (!createdAt) return "- -"

    const now = new Date().toISOString()
    const yearDiff = compareDateDifferenceHelper({
      oldDate: createdAt,
      newDate: now,
      unit: "year",
    })

    if (yearDiff > 0) return `${yearDiff}y`

    const dayDiff = compareDateDifferenceHelper({
      oldDate: createdAt,
      newDate: now,
      unit: "day",
    })

    if (dayDiff > 30) return `${Math.floor(dayDiff / 30)}mo`
    if (dayDiff > 7) return `${Math.floor(dayDiff / 7)}w`
    if (dayDiff > 0) return `${dayDiff}d`

    const hourDiff = compareDateDifferenceHelper({
      oldDate: createdAt,
      newDate: now,
      unit: "hour",
    })

    if (hourDiff > 0) return `${hourDiff}h`

    const minuteDiff = compareDateDifferenceHelper({
      oldDate: createdAt,
      newDate: now,
      unit: "minute",
    })

    if (minuteDiff > 0) return `${minuteDiff}m`
    return "now"
  }, [createdAt])

  return {
    data: formattedCreatedAt,
  }
}

export default useCreatedAt
