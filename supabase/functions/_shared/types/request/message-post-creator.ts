import { IMediaRequest } from "./media"

export interface IMessagePostCreatorRequest {
  post_uuid: string
  body: string
  document: any | null
}
