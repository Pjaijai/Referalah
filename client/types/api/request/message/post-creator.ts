import { IMediaRequest } from "@/types/common/media"

export interface IMessagePostCreatorRequest {
  postUuid: string
  body: string
  document: IMediaRequest | null
}
