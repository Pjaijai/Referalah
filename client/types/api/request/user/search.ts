import { EUserType } from "@/types/common/user-type"

export interface ISearchMemberRequest {
  keywords: string
  numberOfDataPerPage: number
  type: EUserType
  sortingType: string
  page: number
  experience: Number
  industries?: string[]
  locations?: string[]
}
