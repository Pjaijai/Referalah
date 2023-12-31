import { updateConversationLastUpdateAt } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useUpdateConversationLastUpdatedAt = () => {
  return useMutation({
    mutationFn: updateConversationLastUpdateAt,
  })
}

export default useUpdateConversationLastUpdatedAt
