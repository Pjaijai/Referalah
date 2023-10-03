import apiService from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useCreatePost = () => {
  return useMutation({
    mutationFn: apiService.createPost,
  })
}

export default useCreatePost
