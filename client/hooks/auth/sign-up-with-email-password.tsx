import { signUpWithEmailPassword } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useSignUpWithEmailPassword = () => {
  return useMutation({
    mutationFn: signUpWithEmailPassword,
  })
}

export default useSignUpWithEmailPassword
