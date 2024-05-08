import { getMediaPublicUrl } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useGetMediaPublicUrl = () => {
  return useMutation({
    mutationFn: getMediaPublicUrl,
  })
}

export default useGetMediaPublicUrl
