import apiService from "@/utils/common/api"
import { useInfiniteQuery } from "@tanstack/react-query"

import { QueryKeyString } from "@/types/common/query-key-string"
import { ReferralType } from "@/types/common/referral-type"

interface ISearchPostFilterMeta {
  companyName: string
  cityUuid?: string
  provinceUuid?: string
  countryUuid?: string
  industryUuid?: string
  sorting: string
  yoeMax?: string
  yoeMin?: string
}

const useSearchPost = (
  sorting: string,
  filterMeta: ISearchPostFilterMeta,
  type: ReferralType
) => {
  const keyString =
    type === ReferralType.REFEREE
      ? QueryKeyString.SEARCH_REFEREE_POST
      : QueryKeyString.SEARCH_REFERRER_POST
  return useInfiniteQuery({
    queryKey: [keyString, { sorting, filterMeta, type }],
    queryFn: apiService.searchPost,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    getNextPageParam: (lastPage, allPages: any[]) => {
      if (lastPage && lastPage.length > 0) {
        return allPages.length
      } else {
        return null
      }
    },
  })
}

export default useSearchPost
