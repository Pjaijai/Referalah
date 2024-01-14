export interface IMessageReferralRequest {
  type: "referee" | "referer"
  to_uuid: string
  body: string
}
