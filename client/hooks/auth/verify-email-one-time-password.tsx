import { verifyEmailOneTimePassword } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useVerifyOneTimePassword = () => {
  return useMutation({
    mutationFn: verifyEmailOneTimePassword,
  })
}

export default useVerifyOneTimePassword
