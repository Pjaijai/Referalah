import { supabase } from "@/utils/services/supabase/config"
import { useMutation } from "@tanstack/react-query"

import { IUpdateUserProfileRequest } from "@/types/api/request/user/update"

const useUpdateUserProfile = () => {
  const updateUserProfile = async (values: IUpdateUserProfileRequest) => {
    return await supabase
      .from("user")
      .update({
        avatar_url: values.avatarUrl,
        username: values.username,
        description: values.description,
        company_name: values.companyName,
        job_title: values.jobTitle,
        year_of_experience: values.yearOfExperience,
        country_uuid: values.countryUuid,
        province_uuid: values.provinceUuid,
        city_uuid: values.cityUuid,
        industry_uuid: values.industryUuid,
        social_media_url: values.socialMediaUrl,
        is_referer: values.isReferer,
        is_referee: values.isReferee,
      })
      .eq("uuid", values.userId)
  }
  return useMutation(updateUserProfile)
}

export default useUpdateUserProfile
