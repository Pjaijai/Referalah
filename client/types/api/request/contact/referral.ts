export interface IContactReferralRequest {
  type: "referee" | "referer"
  message: string
  toUuid: string
}
