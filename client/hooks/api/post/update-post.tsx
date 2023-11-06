import { updatePost } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useUpdatePost = () => {
  return useMutation({
    mutationFn: updatePost,
  })
}

export default useUpdatePost
