import { messageReferral } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useMessageReferral = () => {
  return useMutation({
    mutationFn: messageReferral,
  })
}

export default useMessageReferral
