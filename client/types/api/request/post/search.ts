import { EPostType } from "@/types/common/post-type"

export interface ISearchPostRequest {
  keywords: string
  numberOfDataPerPage: number
  type: EPostType
  sortingType: string
  page: number
  experience: Number
  industries?: string[]
  locations?: string[]
}
