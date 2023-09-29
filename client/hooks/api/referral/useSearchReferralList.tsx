import { supabase } from "@/utils/services/supabase/config"
import { useInfiniteQuery } from "@tanstack/react-query"

interface ISearchRefererFilterMeta {
  companyName: string
  cityUuid?: string
  provinceUuid?: string
  countryUuid?: string
  industryUuid?: string
  sorting: string
  yoeMax?: string
  yoeMin?: string
}

const useSearchReferralList = (
  sorting: string,
  filterMeta: ISearchRefererFilterMeta,
  type: "referer" | "referee"
) => {
  const fetchRefererList = async ({ pageParam = 0, queryKey }: any) => {
    const NUMBER_OF_DATE_PER_FETCH = 30
    const countryUuid = queryKey[1].filterMeta.countryUuid
    const provinceUuid = queryKey[1].filterMeta.provinceUuid
    const cityUuid = queryKey[1].filterMeta.cityUuid
    const industryUuid = queryKey[1].filterMeta.industryUuid
    const sort = queryKey[1].sorting.split(",")
    const order = sort[1] === "dec" ? false : true
    const from = pageParam * NUMBER_OF_DATE_PER_FETCH
    const to = from + NUMBER_OF_DATE_PER_FETCH

    let query = supabase.from("user").select(
      `
          uuid,
          email,
          username,
          avatar_url,
          description,
          company_name,
          job_title,
          year_of_experience,
        social_media_url,
      country(
        cantonese_name
    ),
    province(
        cantonese_name
    ),
    city(
        cantonese_name
    ),
    industry(
     
        cantonese_name
    ),
    is_referer
    `
    )

    if (type === "referer") {
      query = query.eq("is_referer", true)
    }

    if (type === "referee") {
      query = query.eq("is_referee", true)
    }

    if (countryUuid) {
      query = query.eq("country_uuid", countryUuid)
    }
    if (provinceUuid) {
      query = query.eq("province_uuid", provinceUuid)
    }
    if (cityUuid) {
      query = query.eq("city_uuid", cityUuid)
    }
    if (industryUuid) {
      query = query.eq("industry_uuid", industryUuid)
    }

    if (filterMeta.companyName.length > 0) {
      query = query.ilike("company_name", `%${filterMeta.companyName}%`)
    }

    const { data } = await query
      .lte(
        "year_of_experience",
        filterMeta.yoeMax ? parseInt(filterMeta.yoeMax) : 100
      )
      .gte(
        "year_of_experience",
        filterMeta.yoeMin ? parseInt(filterMeta.yoeMin) : 0
      )
      .order("year_of_experience", { ascending: order })
      .range(from, to)

    return data
  }

  return useInfiniteQuery({
    queryKey: [`${type}-list`, { sorting, filterMeta }],
    queryFn: fetchRefererList,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages: any[]) => {
      if (lastPage && lastPage.length > 0) {
        return allPages.length
      } else {
        return null
      }
    },
  })
}

export default useSearchReferralList
