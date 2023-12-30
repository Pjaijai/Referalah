export interface IMessageReferralRequest {
  type: "referee" | "referrer"
  to_uuid: string
  body: string
}
