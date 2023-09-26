export interface IUpdateUserProfileRequest {
  avatarUrl?: string
  username: string
  description?: string
  companyName?: string
  jobTitle?: string
  yearOfExperience?: number
  countryUuid?: string
  provinceUuid?: string
  cityUuid?: string
  industryUuid?: string
  socialMediaUrl?: string
  isReferer: boolean
  isReferee: boolean
  userUuid: string
}
