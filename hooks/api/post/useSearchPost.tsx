import { supabase } from "@/utils/services/supabase/config"
import { useInfiniteQuery } from "@tanstack/react-query"

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
  type: "referer" | "referee"
) => {
  const fetchPosts = async ({ pageParam = 0, queryKey }: any) => {
    const NUMBER_OF_DATE_PER_FETCH = 3
    const countryUuid = queryKey[1].filterMeta.countryUuid
    const provinceUuid = queryKey[1].filterMeta.provinceUuid
    const cityUuid = queryKey[1].filterMeta.cityUuid
    const industryUuid = queryKey[1].filterMeta.industryUuid
    const sort = queryKey[1].sorting.split(",")
    const order = sort[1] === "dec" ? false : true
    const from = pageParam * NUMBER_OF_DATE_PER_FETCH
    const to = from + NUMBER_OF_DATE_PER_FETCH

    let query = supabase
      .from("post")
      .select(
        `
            created_at,
            url,
            description,
            company_name,
            job_title,
            year_of_experience,
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
            user (
                username,
                avatar_url
            )
          `
      )
      .eq("type", type)
      .ilike("company_name", `%${filterMeta.companyName}%`)
      .lte("year_of_experience", 100)
      .gte("year_of_experience", 0)
      .order("year_of_experience", { ascending: order })
      .range(from, to)

    if (countryUuid !== undefined) {
      query = query.eq("country_uuid", countryUuid)
    }
    if (provinceUuid !== undefined) {
      query = query.eq("province_uuid", provinceUuid)
    }
    if (cityUuid !== undefined) {
      query = query.eq("city_uuid", cityUuid)
    }
    if (industryUuid !== undefined) {
      query = query.eq("industry_uuid", industryUuid)
    }
    const { data } = await query

    return data
  }

  return useInfiniteQuery({
    queryKey: [`${type}-post-list`, { sorting, filterMeta }],
    queryFn: fetchPosts,
    keepPreviousData: true,
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
