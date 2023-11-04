import { ICreatePostRequest } from "@/types/api/request/post/create"
import { PostStatusType } from "@/types/common/post-status"

export interface IUpdatePostRequest extends ICreatePostRequest {
  status?: PostStatusType
  uuid: string
}
