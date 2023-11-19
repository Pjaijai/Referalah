import { EReferralType } from "@/types/common/referral-type"

export interface IContactReferralRequest {
  type: EReferralType
  message: string
  toUuid: string
}
