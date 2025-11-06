import { ISocialLinksData } from "@/types/common/social-links-data"

export interface IUserResponse {
  uuid: string
  email: string
  username: string
  status: string
  role: string
  avatar_url: string | null
  description: string | null
  company_name: string | null
  job_title: string | null
  year_of_experience: number | null
  country: {
    uuid: string
    cantonese_name: string
    english_name: string
  } | null
  province: {
    uuid: string
    cantonese_name: string
    english_name: string
  } | null
  city: {
    uuid: string
    cantonese_name: string
    english_name: string
  } | null
  industry: {
    uuid: string
    cantonese_name: string
    english_name: string
  } | null
  social_media_url: string | null
  is_referer: boolean
  is_referee: boolean
  contact_request_count: number
  links: ISocialLinksData[]
  post_count: { count: number }[]
  notification_permissions: string[]
  location_uuid: string | null
  location: {
    uuid: string
    cantonese_name: string
    english_name: string
  } | null
}
