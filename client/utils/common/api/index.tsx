import { supabase } from "@/utils/services/supabase/config"

import { IContactThroughPostRequest } from "@/types/api/request/contact/post"
import { IContactReferralRequest } from "@/types/api/request/contact/referral"
import { ICreatePostRequest } from "@/types/api/request/post/create"
import { IUpdateUserProfileRequest } from "@/types/api/request/user/update"
import { ICityResponse } from "@/types/api/response/city"
import { IIndustryResponse } from "@/types/api/response/industry"
import { IUserResponse } from "@/types/api/response/user"

const apiService = {
  // User
  getUserProfile: async (arg: any) => {
    try {
      const { data } = await supabase
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
      return data as unknown as IUserResponse
    } catch (err) {
      throw err
    }
  },
  updateUserProfile: async (req: IUpdateUserProfileRequest) => {
    try {
      return await supabase
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
    } catch (err) {
      throw err
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
    } catch (err) {
      throw err
    }
  },

  // Industry
  getIndustryList: async () => {
    const { data: industryData, error: industryError } = await supabase
      .from("industry")
      .select("*")

    if (industryError) {
      throw industryError
    }
    return industryData as IIndustryResponse[]
  },

  // Country
  getCountryList: async () => {
    const { data: countryData, error: countryError } = await supabase
      .from("country")
      .select("*")

    if (countryError) {
      throw countryError
    }

    return countryData as ICityResponse[]
  },

  // Province
  getProvinceList: async () => {
    const { data: provinceData, error: provinceError } = await supabase
      .from("province")
      .select("*")

    if (provinceError) {
      throw provinceError
    }

    return provinceData
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
    } catch (err) {
      throw err
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
    } catch (err) {
      throw err
    }
  },
}

export default apiService
