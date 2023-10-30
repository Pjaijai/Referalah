import { PostStatus } from "@/types/common/post-status"

export interface ISearchPostResponse {
  id: number
  created_at: string // date time string
  created_by: string
  uuid: string | null
  user: {
    username: string
    avatar_url: string | null
  }

  description: string | null
  company_name: string | null
  job_title: string | null
  year_of_experience: number | null
  country: {
    cantonese_name: string
  }
  province: {
    cantonese_name: string
  }
  city: {
    cantonese_name: string
  }
  url: string | null

  industry: {
    cantonese_name: string
  }
}

export interface IGetPostResponse extends Omit<ISearchPostResponse, "id"> {
  status: PostStatus
}
