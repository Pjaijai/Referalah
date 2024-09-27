import { IFilterMeta } from "@/types/api/request/search/filter-meta"
import { EUserType } from "@/types/common/user-type"

export interface IUserFilterMeta extends IFilterMeta {
  type: EUserType
}
