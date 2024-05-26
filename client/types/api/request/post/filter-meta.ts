import { IFilterMeta } from "@/types/api/request/search/filter-meta"
import { EPostType } from "@/types/common/post-type"
import { EReferralType } from "@/types/common/referral-type"

export interface IPostFilterMeta extends IFilterMeta {
  types: EPostType[]
}
