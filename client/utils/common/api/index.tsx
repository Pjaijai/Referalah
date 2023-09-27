import { supabase } from "@/utils/services/supabase/config"

import { IContactThroughPostRequest } from "@/types/api/request/contact/post"
import { IContactReferralRequest } from "@/types/api/request/contact/referral"
import { ICreatePostRequest } from "@/types/api/request/post/create"
import { IUserResponse } from "@/types/api/response/user"

const apiService = {
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

  // create
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

  // contact
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
