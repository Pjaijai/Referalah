import { IFilterMeta } from "@/types/api/request/search/filter-meta"
import { EReferralType } from "@/types/common/referral-type"

export interface IPostFilterMeta extends IFilterMeta {
  types: EReferralType[]
}
