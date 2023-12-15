import { updatePassword } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
  })
}

export default useUpdatePassword
