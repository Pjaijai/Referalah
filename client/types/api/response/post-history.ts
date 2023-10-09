import { PostStatusType } from "@/types/common/post/status"
import { PostType } from "@/types/common/post/type"

export interface IPostHistoryResponse {
  id: number
  created_at: string // datetime string
  created_by: string //uuid
  uuid: string
  type: PostType
  status: PostStatusType
  url: string | null
  country: {
    cantonese_name: string
    uuid: string
  }
  province: {
    cantonese_name: string
    uuid: string
  }
  city: {
    cantonese_name: string
    uuid: string
  }
  industry: {
    cantonese_name: string
    uuid: string
  }
  year_of_experience: number
  company_name: string
  job_title: string
  description: string
}
