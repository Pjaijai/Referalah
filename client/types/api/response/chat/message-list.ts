export interface IMessageListResponse {
  body: string
  conversation_uuid: string
  created_at: string
  id: number
  sender_uuid: string
  status: "active" | "inactive"
  uuid: string
}
