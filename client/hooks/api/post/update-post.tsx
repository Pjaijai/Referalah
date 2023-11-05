import apiService from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useUpdatePost = () => {
  return useMutation({
    mutationFn: apiService.updatePost,
  })
}

export default useUpdatePost
