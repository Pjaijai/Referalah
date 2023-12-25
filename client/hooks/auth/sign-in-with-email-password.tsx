import { signInWithEmailPassword } from "@/utils/common/api"
import { useMutation } from "@tanstack/react-query"

const useSignInWithEmailPassword = () => {
  return useMutation({
    mutationFn: signInWithEmailPassword,
  })
}

export default useSignInWithEmailPassword
