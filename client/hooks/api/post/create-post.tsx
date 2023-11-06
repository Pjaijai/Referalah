import { createPost } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useCreatePost = () => {
  return useMutation({
    mutationFn: createPost,
  })
}

export default useCreatePost
