import compareDateDifferenceHelper from "@/utils/common/helpers/time/compareDateDifference"

export const formatCreatedAt = (date?: string | null) => {
  if (date) {
    const difference = compareDateDifferenceHelper({
      newDate: new Date().toString(),
      oldDate: date,
      unit: "day",
    })

    if (difference === 0) {
      return "今日"
    } else if (difference > 0 && difference < 30) {
      return `${difference}日`
    } else {
      return `30日+`
    }
  }
  return "--"
}
