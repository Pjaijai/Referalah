import dayjs from "dayjs"

interface requiredProps {
  oldDate: string
  newDate: string
  unit:
    | "day"
    | "week"
    | "quarter"
    | "month"
    | "year"
    | "hour"
    | "minute"
    | "second"
    | "millisecond"
}

const compareDateDifferenceHelper = (props: requiredProps) => {
  const { newDate, oldDate, unit } = props

  const newD = dayjs(newDate)
  const oldD = dayjs(oldDate)
  const diff = newD.diff(oldD, unit)

  return diff
}

export default compareDateDifferenceHelper
