import { PostStatusType } from "@/types/common/post-status"

export interface ISearchPostResponse {
  id: number
  created_at: string | null // date time string
  created_by: string | null
  uuid: string | null
  user: {
    username: string | null
    avatar_url: string | null
  } | null
  description: string | null
  company_name: string | null
  job_title: string | null
  year_of_experience: number | null
  country: {
    cantonese_name: string | null
  } | null
  province: {
    cantonese_name: string | null
  } | null
  city: {
    cantonese_name: string | null
  } | null

  industry: {
    cantonese_name: string | null
  } | null
  url: string | null
}

export interface IGetPostResponse extends Omit<ISearchPostResponse, "id"> {
  status: PostStatusType
}
