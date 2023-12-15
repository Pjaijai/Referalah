import { resetPassword } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  })
}

export default useResetPassword
