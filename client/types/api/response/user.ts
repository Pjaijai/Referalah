export interface IUserResponse {
  // id: number
  // created_at: Date
  uuid: string | null
  email: string | null
  username: string
  status: string
  role: string
  avatar_url: string | null
  // chinese_first_name: string | null
  // chinese_last_name: string | null
  // english_first_name: string | null
  // english_last_name: string | null
  description: string | null
  company_name: string | null
  job_title: string | null
  year_of_experience: number | null
  // country_uuid: string | null
  // province_uuid: string | null
  // city_uuid: string | null
  //industry_uuid: string | null

  country: {
    uuid: string
    cantonese_name: string
  }
  province: {
    uuid: string
    cantonese_name: string
  }
  city: {
    uuid: string
    cantonese_name: string
  }
  industry: {
    uuid: string
    cantonese_name: string
  }
  // resume_url: string | null
  social_media_url: string | null
  is_referer: boolean
  is_referee: boolean
}
