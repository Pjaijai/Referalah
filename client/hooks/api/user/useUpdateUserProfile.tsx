import apiService from "@/utils/common/api"
import { supabase } from "@/utils/services/supabase/config"
import { useMutation } from "@tanstack/react-query"

const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: apiService.updateUserProfile,
  })
}

export default useUpdateUserProfile
