import { contactReferral } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useContactReferral = () => {
  return useMutation({
    mutationFn: contactReferral,
  })
}

export default useContactReferral
