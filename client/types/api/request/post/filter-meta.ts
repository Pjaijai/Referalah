import { IFilterMeta } from "@/types/api/request/search/filter-meta"
import { EPostType } from "@/types/common/post-type"

export interface IPostFilterMeta extends IFilterMeta {
  type: EPostType
}
