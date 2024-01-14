export interface IGetConversationListByUserUuidResponse {
  sender_uuid: {
    username: string
    avatar_url: string | null
    uuid: string
    company_name: string
    job_title: string
  }
  receiver_uuid: {
    username: string
    avatar_url: string | null
    uuid: string
    company_name: string
    job_title: string
  }
  uuid: string
  is_receiver_accepted: boolean
  is_receiver_seen: boolean
  is_sender_seen: boolean
  last_message_uuid: {
    uuid: string
    sender_uuid: string
    body: string
    created_at: string
  } | null
  last_updated_at: string //datetime string withe time zone
}
