import { EPostType } from "@/types/common/post-type"

export interface ISearchPostsRequest {
  numberOfDataPerPage: number
  types: EPostType[]
  companyName: string
  maxYearOfExperience: number
  minYearOfExperience: number
  jobTitle: string
  sortingType: string
  page: number
  countryUuid?: string
  provinceUuid?: string
  cityUuid?: string
  industryUuid?: string
}
