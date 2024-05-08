import { downloadMedia } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useDownLoadMedia = () => {
  return useMutation({
    mutationFn: downloadMedia,
  })
}

export default useDownLoadMedia
