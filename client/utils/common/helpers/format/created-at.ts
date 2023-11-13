import { formatDate } from "@/utils/common/helpers/format/date"
import compareDateDifferenceHelper from "@/utils/common/helpers/time/compareDateDifference"

export const formatCreatedAt = (
  date?: string | null
): { formattedDate: string; isExact?: boolean } => {
  if (date) {
    const difference = compareDateDifferenceHelper({
      newDate: new Date().toString(),
      oldDate: date,
      unit: "day",
    })

    if (difference === 0) {
      return { formattedDate: "今日", isExact: true }
    } else if (difference > 0 && difference < 30) {
      return { formattedDate: `${difference}日`, isExact: false }
    } else {
      return {
        formattedDate: formatDate("YYYY年MM月DD日", date),
        isExact: true,
      }
    }
  }
  return { formattedDate: "--" }
}
