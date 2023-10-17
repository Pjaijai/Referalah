import { supabase } from "@/utils/services/supabase/config"

import { IContactThroughPostRequest } from "@/types/api/request/contact/post"
import { IContactReferralRequest } from "@/types/api/request/contact/referral"
import { ICreatePostRequest } from "@/types/api/request/post/create"
import { IUpdateUserProfileRequest } from "@/types/api/request/user/update"
import { ICityResponse } from "@/types/api/response/city"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IUserResponse } from "@/types/api/response/user"
import { ReferralType } from "@/types/common/referral-type"

const apiService = {
  // User Profile
  getUserProfile: async (arg: any) => {
    try {
      const { data, error } = await supabase
        .from("user")
        .select(
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
        .eq("uuid", arg.queryKey[1].userUuid)
        .single()

      if (error) throw error

      // TODO: Fix type casting
      return data as unknown as IUserResponse
    } catch (err) {
      throw err
    }
  },
  updateUserProfile: async (req: IUpdateUserProfileRequest) => {
    try {
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
    } catch (error) {
      throw error
    }
  },
  searchReferral: async ({ pageParam = 0, queryKey }: any) => {
    try {
      const NUMBER_OF_DATE_PER_FETCH = 10
      const countryUuid = queryKey[1].filterMeta.countryUuid
      const provinceUuid = queryKey[1].filterMeta.provinceUuid
      const cityUuid = queryKey[1].filterMeta.cityUuid
      const industryUuid = queryKey[1].filterMeta.industryUuid
      const companyName = queryKey[1].filterMeta.companyName
      const jobTitle = queryKey[1].filterMeta.jobTitle
      const yoeMax = queryKey[1].filterMeta.yoeMax
      const yoeMin = queryKey[1].filterMeta.yoeMin
      const type = queryKey[1].type satisfies ReferralType

      const sort = queryKey[1].sorting.split(",")
      const order = sort[1] === "dec" ? false : true
      const from = pageParam * NUMBER_OF_DATE_PER_FETCH
      const to = from + NUMBER_OF_DATE_PER_FETCH

      let query = supabase
        .from("user")
        .select(
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
            is_referer,
            is_referee
          `
        )
        .lte("year_of_experience", yoeMax ? parseInt(yoeMax) : 100)
        .gte("year_of_experience", yoeMin ? parseInt(yoeMin) : 0)
        .order("year_of_experience", { ascending: order })
        .order("id", { ascending: true })
        .range(from, to)

      if (type === ReferralType.REFERRER) {
        query = query.eq("is_referer", true)
      }

      if (type === ReferralType.REFEREE) {
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

      return data
    } catch (error) {
      throw error
    }
  },

  // Post
  createPost: async (req: ICreatePostRequest) => {
    try {
      await supabase.from("post").insert({
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
    } catch (error) {
      throw error
    }
  },
  searchPost: async ({ pageParam = 0, queryKey }: any) => {
    try {
      const NUMBER_OF_DATE_PER_FETCH = 3
      const type = queryKey[1].type as ReferralType
      const countryUuid = queryKey[1].filterMeta.countryUuid
      const provinceUuid = queryKey[1].filterMeta.provinceUuid
      const cityUuid = queryKey[1].filterMeta.cityUuid
      const industryUuid = queryKey[1].filterMeta.industryUuid
      const companyName = queryKey[1].filterMeta.companyName
      const jobTitle = queryKey[1].filterMeta.jobTitle
      const sort = queryKey[1].sorting.split(",")
      const sortingType = sort[0]
      const order = sort[1] === "dec" ? false : true
      const from = pageParam * NUMBER_OF_DATE_PER_FETCH
      const to = from + NUMBER_OF_DATE_PER_FETCH - 1

      let query = supabase
        .from("post")
        .select(
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

        .range(from, to)

      if (sortingType === "createdAt") {
        query = query.order("created_at", { ascending: order })
      }

      if (sortingType === "yoe") {
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

      return data
    } catch (error) {
      throw error
    }
  },

  // Industry
  getIndustryList: async () => {
    try {
      const { data: industryData, error: industryError } = await supabase
        .from("industry")
        .select("*")

      if (industryError) {
        throw industryError
      }
      return industryData as IIndustryResponse[]
    } catch (error) {
      throw error
    }
  },

  // Country
  getCountryList: async () => {
    try {
      const { data: countryData, error: countryError } = await supabase
        .from("country")
        .select("*")

      if (countryError) {
        throw countryError
      }

      return countryData
    } catch (error) {
      throw error
    }
  },

  // Province
  getProvinceList: async () => {
    try {
      const { data: provinceData, error: provinceError } = await supabase
        .from("province")
        .select("*")

      if (provinceError) {
        throw provinceError
      }

      return provinceData
    } catch (error) {
      throw error
    }
  },

  // City
  getCityList: async () => {
    const { data, error } = await supabase.from("city").select("*")

    if (error) {
      throw error
    }

    return data
  },
  // Contact
  contactReferral: async (req: IContactReferralRequest) => {
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
  },
  contactThroughPost: async (req: IContactThroughPostRequest) => {
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
  },

  // Statistic
  getUserCount: async () => {
    try {
      const { count, error } = await supabase
        .from("user")
        .select("id", { count: "exact" })

      if (error) throw error
      return count
    } catch (error) {
      throw error
    }
  },
}

export default apiService
