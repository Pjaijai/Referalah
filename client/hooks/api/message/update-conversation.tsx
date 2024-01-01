import { updateConversation } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useUpdateConversation = () => {
  return useMutation({
    mutationFn: updateConversation,
  })
}

export default useUpdateConversation
