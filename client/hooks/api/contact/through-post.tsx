import { contactThroughPost } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useContactThroughPost = () => {
  return useMutation({
    mutationFn: contactThroughPost,
  })
}

export default useContactThroughPost
