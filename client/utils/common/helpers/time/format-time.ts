import dayjs from "dayjs"

interface IFormatTimeHelperParams {
  date: string // datetime string
  format?: string
}
const formatTimeHelper = (param: IFormatTimeHelperParams) => {
  const { date, format } = param
  if (format) return dayjs(date).format(format)

  return dayjs(date).format("YYYY/MM/DD")
}

export default formatTimeHelper
