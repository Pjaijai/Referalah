export interface IMessageListResponse {
  body: string | null
  conversation_uuid: string
  created_at: string
  id: number
  sender_uuid: string
  status: "active" | "inactive"
  uuid: string
  document: any //IMediaResponse
  is_document_expired: boolean
}
