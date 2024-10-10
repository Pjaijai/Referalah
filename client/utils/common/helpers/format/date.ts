import dayjs from "dayjs"

export const formatDate = (format: string, date?: string | null) => {
  if (!date) return "--"

  const formattedDate = dayjs(date)

  // Check if the date is valid
  if (!formattedDate.isValid()) return "--"

  return formattedDate.format(format)
}
