import { EReferralType } from "@/types/common/referral-type"

export interface ISearchPostsRequest {
  numberOfDataPerPage: number
  type: EReferralType
  countryUuid?: string
  provinceUuid?: string
  cityUuid?: string
  industryUuid?: string
  companyName: string
  maxYearOfExperience: number
  minYearOfExperience: number
  jobTitle: string
  sortingType: string
  page: number
}
