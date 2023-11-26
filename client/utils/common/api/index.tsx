import { supabase } from "@/utils/services/supabase/config"

import { IContactThroughPostRequest } from "@/types/api/request/contact/post"
import { IContactReferralRequest } from "@/types/api/request/contact/referral"
import { ICreatePostRequest } from "@/types/api/request/post/create"
import { IFilterMeta } from "@/types/api/request/post/filter-meta"
import { ISearchPostsRequest } from "@/types/api/request/post/search"
import { IUpdatePostRequest } from "@/types/api/request/post/update"
import { ICreateUserEmailPasswordRequest } from "@/types/api/request/user/create-user-with-email-password"
import { IUpdateUserProfileRequest } from "@/types/api/request/user/update"
import { ICityResponse } from "@/types/api/response/city"
import { ICountryResponse } from "@/types/api/response/country"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IProvinceResponse } from "@/types/api/response/province"
import {
  IGetPostResponse,
  IListPostResponse,
  ISearchPostResponse,
} from "@/types/api/response/referer-post"
import { IReferralResponse } from "@/types/api/response/referral"
import { IUserResponse } from "@/types/api/response/user"
import { EQueryKeyString } from "@/types/common/query-key-string"
import { EReferralType } from "@/types/common/referral-type"

// User Profile
export const getUserProfile = async (userUuid: string) => {
  try {
    const { data, error } = await supabase
      .from("user")
      .select<string, IUserResponse>(
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
          uuid,
          cantonese_name
      ),
      province(
        uuid,
          cantonese_name
      ),
      city(
        uuid,
          cantonese_name
      ),
      industry(
        uuid,
          cantonese_name
      ),
      is_referer,
      is_referee
      `
      )
      .eq("uuid", userUuid)
      .single()

    if (error) throw error
    if (data === null) throw new Error(`Cannot found user ${userUuid}`)

    return data
  } catch (error) {
    throw error
  }
}

// Auth
export const createUserWithEmailPassword = async (
  req: ICreateUserEmailPasswordRequest
) => {
  const { email, password } = req
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_WEB_URL}`,
      },
    })

    if (error) {
      throw error
    }
    return data
  } catch (error) {
    throw error
  }
}
export const updateUserProfile = async (req: IUpdateUserProfileRequest) => {
  const { data, error } = await supabase
    .from("user")
    .update({
      avatar_url: req.avatarUrl,
      username: req.username,
      description: req.description,
      company_name: req.companyName,
      job_title: req.jobTitle,
      year_of_experience: req.yearOfExperience,
      country_uuid: req.countryUuid,
      province_uuid: req.provinceUuid,
      city_uuid: req.cityUuid,
      industry_uuid: req.industryUuid,
      social_media_url: req.socialMediaUrl,
      is_referer: req.isReferer,
      is_referee: req.isReferee,
    })
    .eq("uuid", req.userUuid)

  if (error) {
    throw error
  }

  return data
}
export const searchReferral = async ({
  pageParam = 0,
  queryKey,
}: {
  pageParam?: number
  queryKey: [
    EQueryKeyString,
    {
      sorting: string
      filterMeta: IFilterMeta
      type: EReferralType
    },
  ]
}) => {
  const NUMBER_OF_DATE_PER_FETCH = 5
  const countryUuid = queryKey[1].filterMeta.countryUuid
  const provinceUuid = queryKey[1].filterMeta.provinceUuid
  const cityUuid = queryKey[1].filterMeta.cityUuid
  const industryUuid = queryKey[1].filterMeta.industryUuid
  const companyName = queryKey[1].filterMeta.companyName
  const jobTitle = queryKey[1].filterMeta.jobTitle
  const maxYearOfExperience = queryKey[1].filterMeta.maxYearOfExperience
  const minYearOfExperience = queryKey[1].filterMeta.minYearOfExperience
  const type = queryKey[1].type

  const sort = queryKey[1].sorting.split(",")
  const order = sort[1] !== "dec"

  const from = pageParam + pageParam * NUMBER_OF_DATE_PER_FETCH
  const to = from + NUMBER_OF_DATE_PER_FETCH

  let query = supabase
    .from("user")
    .select<string, IReferralResponse>(
      `
            uuid,
            username,
            avatar_url,
            description,
            company_name,
            job_title,
            year_of_experience,
            social_media_url,
            country(
              uuid,
              cantonese_name
            ),
            province(
              uuid,
              cantonese_name
            ),
            city(
              uuid,
              cantonese_name
            ),
            industry(
              uuid,
              cantonese_name
            ),
            is_referer,
            is_referee
          `
    )
    .lte(
      "year_of_experience",
      maxYearOfExperience ? parseInt(maxYearOfExperience) : 100
    )
    .gte(
      "year_of_experience",
      minYearOfExperience ? parseInt(minYearOfExperience) : 0
    )
    .order("year_of_experience", { ascending: order })
    .order("id", { ascending: true })
    .range(from, to)

  if (type === EReferralType.REFERRER) {
    query = query.eq("is_referer", true)
  }

  if (type === EReferralType.REFEREE) {
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

  if (companyName.length > 0) {
    query = query.ilike("company_name", `%${companyName}%`)
  }

  if (jobTitle.length > 0) {
    query = query.ilike("job_title", `%${jobTitle}%`)
  }

  const { data, error } = await query

  if (error) throw error
  if (data === null) return []

  return data
}

// Post
export const createPost = async (req: ICreatePostRequest) => {
  try {
    const { data, error } = await supabase
      .from("post")
      .insert({
        url: req.url,
        country_uuid: req.countryUuid,
        province_uuid: req.provinceUuid,
        city_uuid: req.cityUuid,
        industry_uuid: req.industryUuid,
        year_of_experience: req.yearOfExperience,
        created_by: req.createdBy,
        type: req.type,
        company_name: req.companyName.trim(),
        job_title: req.jobTitle.trim(),
        description: req.description.trim(),
      })
      .select("uuid")
      .single()

    if (error) throw error
    return data
  } catch (error) {
    throw error
  }
}
export const updatePost = async (req: IUpdatePostRequest) => {
  try {
    const { data, error } = await supabase
      .from("post")
      .update({
        status: req.status,
        url: req.url,
        country_uuid: req.countryUuid,
        province_uuid: req.provinceUuid,
        city_uuid: req.cityUuid,
        industry_uuid: req.industryUuid,
        year_of_experience: req.yearOfExperience,
        created_by: req.createdBy,
        type: req.type,
        company_name: req.companyName.trim(),
        job_title: req.jobTitle.trim(),
        description: req.description.trim(),
      })
      .eq("uuid", req.uuid)

    if (error) throw error
    return data
  } catch (error) {
    throw error
  }
}
export const searchPostApi = async ({
  cityUuid,
  companyName,
  industryUuid,
  jobTitle,
  numberOfDataPerPage,
  countryUuid,
  page,
  provinceUuid,
  sortingType,
  type,
  maxYearOfExperience,
  minYearOfExperience,
}: ISearchPostsRequest) => {
  try {
    const sort = sortingType.split(",")
    const sortedBy = sort[0]
    const order = sort[1] !== "dec"
    const from = page + page * numberOfDataPerPage
    const to = from + numberOfDataPerPage

    let query = supabase
      .from("post")
      .select<string, ISearchPostResponse>(
        `   uuid,
              created_at,
              created_by,
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
      .eq("status", "active")
      .lte("year_of_experience", 100)
      .gte("year_of_experience", 0)
      .lte("year_of_experience", maxYearOfExperience)
      .gte("year_of_experience", minYearOfExperience)
      .range(from, to)

    if (sortedBy === "createdAt") {
      query = query.order("created_at", { ascending: order })
    }

    if (sortedBy === "year_of_experience") {
      query = query.order("year_of_experience", { ascending: order })
    }
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

    if (companyName.length > 0) {
      query = query.ilike("company_name", `%${companyName}%`)
    }

    if (jobTitle.length > 0) {
      query = query.ilike("job_title", `%${jobTitle}%`)
    }
    const { data, error } = await query.order("id", { ascending: true })

    if (error) throw error
    if (data === null) return []

    return data
  } catch (error) {
    throw error
  }
}
export const getPostByUuid = async (uuid: string) => {
  const { data, error } = await supabase
    .from("post")
    .select<string, IGetPostResponse>(
      `   uuid,
              status,
              created_at,
              created_by,
              url,
              description,
              company_name,
              job_title,
              year_of_experience,
              country(
                  uuid,
                  cantonese_name
              ),
              province(
                  uuid,
                  cantonese_name
              ),
              city(
                 uuid,
                  cantonese_name
              ),
              industry(
                  uuid,
                  cantonese_name
              ),
              user (
                  uuid,
                  username,
                  avatar_url,
                  job_title
              )
            `
    )
    .eq("uuid", uuid)
    .single()

  if (error) throw error
  if (data === null) throw new Error(`Post not found for uuid ${uuid}`)

  return data
}

export const getPostListByUserUuid = async (userUuid: string) => {
  try {
    const { data, error } = await supabase
      .from("post")
      .select<string, IListPostResponse>(
        `
        *,
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
        user(
          username,
          avatar_url
        )
        `
      )
      .eq("created_by", userUuid)

    if (error) throw error

    return data
  } catch (error) {
    throw error
  }
}

// Industry
export const getIndustryList = async () => {
  try {
    const { data: industryData, error: industryError } = await supabase
      .from("industry")
      .select<"*", IIndustryResponse>("*")

    if (industryError) {
      throw industryError
    }
    if (industryData === null) return []

    return industryData
  } catch (error) {
    throw error
  }
}

// Country
export const getCountryList = async () => {
  try {
    const { data: countryData, error: countryError } = await supabase
      .from("country")
      .select<"*", ICountryResponse>("*")

    if (countryError) {
      throw countryError
    }

    return countryData
  } catch (error) {
    throw error
  }
}

// Province
export const getProvinceList = async () => {
  try {
    const { data: provinceData, error: provinceError } = await supabase
      .from("province")
      .select<"*", IProvinceResponse>("*")

    if (provinceError) {
      throw provinceError
    }

    return provinceData
  } catch (error) {
    throw error
  }
}

// City
export const getCityList = async () => {
  const { data, error } = await supabase
    .from("city")
    .select<"*", ICityResponse>("*")

  if (error) {
    throw error
  }

  return data
}
// Contact
export const contactReferral = async (req: IContactReferralRequest) => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "contact-referral",
      {
        body: {
          type: req.type,
          message: req.message,
          to_uuid: req.toUuid,
        },
      }
    )

    if (error) {
      throw error
    }
  } catch (error) {
    throw error
  }
}
export const contactThroughPost = async (req: IContactThroughPostRequest) => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "contact-through-post",
      {
        body: {
          message: req.message,
          post_uuid: req.postUuid,
        },
      }
    )

    if (error) {
      throw error
    }
  } catch (error) {
    throw error
  }
}

// Statistic
export const getUserCount = async () => {
  try {
    const { count, error } = await supabase
      .from("user")
      .select("id", { count: "exact" })

    if (error) throw error
    return count
  } catch (error) {
    throw error
  }
}
// }

// export default apiService
