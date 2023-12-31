import { createMessage } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useCreateMessage = () => {
  return useMutation({
    mutationFn: createMessage,
  })
}

export default useCreateMessage
