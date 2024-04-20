import { EReferralType } from "@/types/common/referral-type"

const isTypeExitsInCurrentTypes = (
  types: EReferralType[],
  targetType: EReferralType
) => {
  return types.includes(targetType)
}

export { isTypeExitsInCurrentTypes }
