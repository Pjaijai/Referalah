import { supabase } from "@/utils/services/supabase/config"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { IUpdateUserProfileRequest } from "@/types/api/request/user/update"

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()
  let userUuid: string
  const updateUserProfile = async (values: IUpdateUserProfileRequest) => {
    userUuid = values.userUuid
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
      .eq("uuid", values.userUuid)
  }
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (values) => {
      queryClient.invalidateQueries({
        queryKey: ["user-profile", { userUuid: userUuid }],
      })
    },
  })
}

export default useUpdateUserProfile
