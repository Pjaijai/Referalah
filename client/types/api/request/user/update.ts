import { ISocialLinksData } from "@/types/common/social-links-data"

export interface IUpdateUserProfileRequest {
  avatarUrl?: string
  username: string
  description?: string
  companyName?: string
  jobTitle?: string
  yearOfExperience?: number
  countryUuid?: string
  provinceUuid?: string | null
  cityUuid?: string | null
  industryUuid?: string
  socialMediaUrl?: string
  isReferer: boolean
  isReferee: boolean
  userUuid: string
  links: ISocialLinksData[]
}
