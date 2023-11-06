import { updateUserProfile } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"





const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: updateUserProfile,
  })
}

export default useUpdateUserProfile
