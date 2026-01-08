import dayjs from "dayjs"

import { isChineseLocale } from "@/types/common/enums/locale"

const formatVagueDateHelper = (isoString: string, locale: string): string => {
  const date = dayjs(isoString)
  if (!date.isValid()) return "Invalid Date"

  const day = date.date()
  const year = date.year()
  const month = date.month() + 1

  if (isChineseLocale(locale))
    return `${year}年${month}月${day <= 10 ? "初" : day <= 20 ? "中" : "尾"}`

  return `${day <= 10 ? "Early" : day <= 20 ? "Mid" : "Late"} ${date.format(
    "MMM YYYY"
  )}`
}

export default formatVagueDateHelper
