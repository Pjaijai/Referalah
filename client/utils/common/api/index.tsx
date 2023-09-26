import { supabase } from "@/utils/services/supabase/config"

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
}

export default apiService
