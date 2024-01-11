import { bulkUpdateNotifications } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useBulkUpdateNotifications = () => {
  return useMutation({
    mutationFn: bulkUpdateNotifications,
  })
}

export default useBulkUpdateNotifications
