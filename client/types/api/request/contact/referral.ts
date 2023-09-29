import { ReferralType } from "@/types/common/referral-type"

export interface IContactReferralRequest {
  type: ReferralType
  message: string
  toUuid: string
}
