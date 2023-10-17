export interface IUserResponse {
  uuid: string | null
  email: string | null
  username: string | null
  status: string
  role: string
  avatar_url: string | null
  description: string | null
  company_name: string | null
  job_title: string | null
  year_of_experience: number | null
  country: {
    uuid: string
    cantonese_name: string | null
  } | null
  province: {
    uuid: string
    cantonese_name: string | null
  } | null
  city: {
    uuid: string
    cantonese_name: string | null
  } | null
  industry: {
    uuid: string
    cantonese_name: string | null
  } | null
  // resume_url: string | null
  social_media_url: string | null
  is_referer: boolean
  is_referee: boolean
}
