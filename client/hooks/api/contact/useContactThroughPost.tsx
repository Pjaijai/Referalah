import apiService from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useContactThroughPost = () => {
  return useMutation({
    mutationFn: apiService.contactThroughPost,
  })
}

export default useContactThroughPost
