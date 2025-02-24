import { bulkUpdateNotificationsSeen } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useBulkUpdateNotificationsSeen = () => {
  return useMutation({
    mutationFn: bulkUpdateNotificationsSeen,
  })
}

export default useBulkUpdateNotificationsSeen
