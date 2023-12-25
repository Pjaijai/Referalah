import { ICreatePostRequest } from "@/types/api/request/post/create"
import { TPostStatusType } from "@/types/common/post-status"

export interface IUpdatePostRequest extends ICreatePostRequest {
  status?: TPostStatusType
  uuid: string
}
