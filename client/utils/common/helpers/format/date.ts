import dayjs from "dayjs"

export const formatDate = ( format: string,date?: string | null,) => {

  if(!date )return '--'

  return dayjs(date).format(format)
}
