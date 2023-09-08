import { useEffect, useState } from "react"
import { supabase } from "@/utils/services/supabase/config"
import { useInfiniteQuery } from "@tanstack/react-query"

import { IRefererResponse } from "@/types/api/response/referer-list"

interface ISearchRefererFilterMeta {
  companyName: string
  cityUuid?: string
  provinceUuid?: string
  countryUuid?: string
  industryUuid?: string
  sorting: string
  yoeMax?: string
  yoeMin?: string
  // page: number
}
const useSearchRefererList = (
  sorting: string,
  filterMeta: ISearchRefererFilterMeta
) => {
  const fetchRefererList = async ({ pageParam = 0, queryKey }: any) => {
    const NUMBER_OF_DATE_PER_FETCH = 6
    const countryUuid = queryKey[1].filterMeta.countryUuid
    const provinceUuid = queryKey[1].filterMeta.provinceUuid
    const cityUuid = queryKey[1].filterMeta.cityUuid
    const industryUuid = queryKey[1].filterMeta.industryUuid
    const sort = queryKey[1].sorting.split(",")
    const order = sort[1] === "dec" ? false : true
    const from = pageParam * NUMBER_OF_DATE_PER_FETCH
    const to = from + NUMBER_OF_DATE_PER_FETCH

    let query = supabase
      .from("user")
      .select(
        `
        username,
        avatar_url,
        chinese_first_name,
        chinese_last_name,
        english_first_name,
        english_last_name,
        description,
        company_name,
        job_title,
        year_of_experience,
        country_uuid,
        province_uuid,
        city_uuid,
        social_media_url,
        industry_uuid
      `
      )
      .eq("is_referer", true)
      .ilike("company_name", `%${filterMeta.companyName}%`)
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
    queryKey: ["referer-list", { sorting, filterMeta }],
    queryFn: fetchRefererList,
    getNextPageParam: (lastPage, allPages: any[]) => {
      if (
        lastPage === undefined ||
        (typeof lastPage !== "undefined" && !(lastPage.length > 0))
      ) {
        return undefined
      }
      return allPages.length
    },
  })
}

export default useSearchRefererList
