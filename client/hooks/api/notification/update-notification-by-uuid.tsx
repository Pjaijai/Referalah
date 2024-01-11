import { updateNotificationByUuid } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useUpdateNotificationByUuid = () => {
  return useMutation({
    mutationFn: updateNotificationByUuid,
  })
}

export default useUpdateNotificationByUuid
