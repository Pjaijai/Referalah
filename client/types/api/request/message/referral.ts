import { EReferralType } from "@/types/common/referral-type"

export interface IMessageReferralRequest {
  type: EReferralType
  body: string
  toUuid: string
}
