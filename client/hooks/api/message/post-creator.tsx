import { messagePostCreator } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useMessagePostCreator = () => {
  return useMutation({
    mutationFn: messagePostCreator,
  })
}

export default useMessagePostCreator
