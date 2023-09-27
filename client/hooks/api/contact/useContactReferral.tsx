import apiService from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useContactReferral = () => {
  return useMutation({
    mutationFn: apiService.contactReferral,
  })
}

export default useContactReferral
